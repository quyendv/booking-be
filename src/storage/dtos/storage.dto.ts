import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class StorageUploadDto {
  @IsOptional()
  @IsString()
  folder?: string;
}

export class UploadByUrlDto extends StorageUploadDto {
  @IsNotEmpty()
  @IsUrl()
  url: string;
}
