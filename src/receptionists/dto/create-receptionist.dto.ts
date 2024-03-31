import { IsInt, IsNotEmpty } from 'class-validator';
import { ProfileDto } from '~/base/dto/base.dto';

export class CreateReceptionistDto extends ProfileDto {
  @IsNotEmpty()
  @IsInt()
  hotelId: number;
}
