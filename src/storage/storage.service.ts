import { Bucket } from '@google-cloud/storage';
import { BadRequestException, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { getDownloadURL } from 'firebase-admin/storage';
import { StorageFolders } from './constants/storage.constant';
import { StorageUploadResult } from './types/storage.type';
import axios from 'axios';

@Injectable()
export class StorageService {
  private generateFilePath(originalname: string, folder: string, prefix: string): string {
    return `${folder.endsWith('/') ? folder : `${folder}/`}${
      prefix ? `${prefix}-` : prefix
    }${Date.now()}-${originalname.replace(/\s/g, '_')}`; // TODO: Validate file name to match(/^[A-Za-z0-9_-]+$/), not contain special characters like ~,!,@,#,$,%,^,&,*,(,),+,=,whitespace
  }

  async uploadFile(
    file: Express.Multer.File | undefined,
    folder = StorageFolders.DEFAULT,
    prefix = '',
    _bucket?: Bucket,
  ): Promise<StorageUploadResult | null> {
    if (!file) throw new BadRequestException('File is required');
    if ((file.originalname === 'blob' || file.originalname === '') && file.size === 0) {
      return Promise.resolve(null); // not upload and remove key from db -> new Blob() or new Blob('blob')
    }

    const bucket = _bucket ?? admin.storage().bucket();

    const filePath = this.generateFilePath(file.originalname, folder, prefix);
    const blob = bucket.file(filePath);
    const blobStream = blob.createWriteStream({ contentType: file.mimetype });

    return new Promise((resolve, reject) => {
      blobStream.on('error', (err) => {
        reject(err);
      });
      blobStream.on('finish', async () => {
        const publicUrl = await getDownloadURL(blob);
        resolve({ key: filePath, url: publicUrl });
      });
      blobStream.end(file.buffer);
    });
  }

  private async getFileFromImageUrl(url: string): Promise<any> {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data, 'binary');
    const file: any = {
      buffer,
      originalname: `${url.split('/').pop()?.split('?')[0]}-${Date.now()}` || `${Date.now()}`,
      mimetype: response.headers['content-type'],
      size: buffer.length,
    };
    return file;
  }

  async uploadFromUrl(
    url: string,
    folder = StorageFolders.DEFAULT,
    prefix = '',
    _bucket?: Bucket,
  ): Promise<StorageUploadResult | null> {
    const file = await this.getFileFromImageUrl(url);
    return this.uploadFile(file, folder, prefix, _bucket);
  }

  async uploadMultiple(
    files: Express.Multer.File[],
    folder = StorageFolders.DEFAULT,
    prefix = '',
  ): Promise<(StorageUploadResult | null)[]> {
    const bucket = admin.storage().bucket();
    const result = await Promise.all(
      files.map((file) => this.uploadFile(file, folder, prefix, bucket)),
    );
    return result;
  }

  async getPublicURL(filePath: string): Promise<string> {
    const bucket = admin.storage().bucket();
    const file = bucket.file(filePath);
    return await getDownloadURL(file);
  }

  async delete(filePath: string): Promise<boolean> {
    try {
      const bucket = admin.storage().bucket();
      const file = bucket.file(filePath);
      await file.delete();
      return true;
    } catch (error) {
      return false;
    }
  }
}
