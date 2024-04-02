import { IsInt, IsNotEmpty } from 'class-validator';
import { ProfileDto } from '~/base/dtos/base.dto';

export class CreateReceptionistDto extends ProfileDto {
  @IsNotEmpty()
  @IsInt()
  hotelId: number;
}
