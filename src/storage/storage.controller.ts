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
import { StorageUploadDto, UploadByUrlDto } from './dto/storage.dto';
import { StorageService } from './storage.service';
import { StorageUploadResult } from './types/storage.type';

@ApiTags('Storage')
@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('upload/single')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: StorageUploadDto,
  ): Promise<StorageUploadResult | null> {
    return this.storageService.uploadFile(file, body.folder);
  }

  @Post('upload/multiple')
  @UseInterceptors(FilesInterceptor('files'))
  uploadMultipleFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: StorageUploadDto,
  ): Promise<(StorageUploadResult | null)[]> {
    return this.storageService.uploadMultiple(files, body.folder);
  }

  @Post('upload/url')
  async uploadFromURL(@Body() body: UploadByUrlDto): Promise<StorageUploadResult | null> {
    return this.storageService.uploadFromUrl(body.url, body.folder);
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
