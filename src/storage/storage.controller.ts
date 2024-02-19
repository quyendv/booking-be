import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { UploadByUrlDto } from './dto/storage.dto';
import { StorageService } from './storage.service';
import { StorageUploadResult } from './types/storage.type';

@ApiTags('Storage')
@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('upload/single')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File): Promise<StorageUploadResult | null> {
    return this.storageService.uploadFile(file);
  }

  @Post('upload/multiple')
  @UseInterceptors(FilesInterceptor('files'))
  uploadMultipleFiles(
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<(StorageUploadResult | null)[]> {
    return this.storageService.uploadMultiple(files);
  }

  @Post('upload/url')
  async uploadFromURL(@Body() body: UploadByUrlDto): Promise<StorageUploadResult | null> {
    return this.storageService.uploadFromUrl(body.url);
  }

  @Get(':filename')
  getPublicURL(@Param('filename') fileName: string): Promise<string> {
    return this.storageService.getPublicURL(fileName);
  }

  @Delete(':filename')
  deleteFile(@Param('filename') fileName: string): Promise<boolean> {
    return this.storageService.delete(fileName);
  }
}
