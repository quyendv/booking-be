import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ProfileDto } from '~/base/dtos/base.dto';

export class CreateReceptionistDto extends ProfileDto {
  @IsNotEmpty()
  @IsInt()
  hotelId: number;

  @IsOptional()
  @IsString()
  password?: string;
}
