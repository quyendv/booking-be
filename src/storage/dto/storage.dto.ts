import { IsNotEmpty, IsUrl } from 'class-validator';

export class UploadByUrlDto {
  @IsNotEmpty()
  @IsUrl()
  url: string;
}
