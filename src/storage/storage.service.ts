import { Bucket } from '@google-cloud/storage';
import { BadRequestException, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { getDownloadURL } from 'firebase-admin/storage';
import { StorageUploadResult } from './types/storage.type';

const ROOT_FOLDER = 'default';

@Injectable()
export class StorageService {
  async upload(
    file: Express.Multer.File,
    folder = ROOT_FOLDER,
    _bucket?: Bucket,
  ): Promise<StorageUploadResult | null> {
    if (!file) throw new BadRequestException('File is required');
    if ((file.originalname === 'blob' || file.originalname === '') && file.size === 0) {
      return Promise.resolve(null); // not upload and remove key from db -> new Blob() or new Blob('blob')
    }

    const bucket = _bucket ?? admin.storage().bucket();

    const filePath = `${
      folder.endsWith('/') ? folder : `${folder}/`
    }${Date.now()}-${file.originalname.replace(/\s/g, '_')}`; // TODO: Validate file name to match(/^[A-Za-z0-9_-]+$/), not contain special characters like ~,!,@,#,$,%,^,&,*,(,),+,=,whitespace

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

  async uploadMultiple(
    files: Express.Multer.File[],
    folder = ROOT_FOLDER,
  ): Promise<(StorageUploadResult | null)[]> {
    const bucket = admin.storage().bucket();
    const result = await Promise.all(files.map((file) => this.upload(file, folder, bucket)));
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
