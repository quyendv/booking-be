import { Exclude, Expose, Transform } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsOptional } from 'class-validator';
import { UserEntity } from '~/users/entities/user.entity';
import { ReceptionistEntity } from '../entities/receptionist.entity';

export class ListReceptionistQueryDto {
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  hotelIds?: number[];
}

export class ReceptionistInfoDto extends ReceptionistEntity {
  @Expose()
  createdAt: Date;

  @Exclude({ toPlainOnly: true })
  user: UserEntity;

  @Expose()
  get isVerified(): boolean {
    return !!this.user?.isVerified;
  }

  // @Expose()
  // hotelId: number; // need remove @Exclude({ toPlainOnly: true }) from ReceptionistEntity
}

// export class HotelReceptionistDto extends HotelEntity {
//   @Expose()
//   receptionists: ReceptionistInfoDto[];

//   @Expose()
//   createdAt: Date;
// }

export class HotelReceptionistDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  receptionists: ReceptionistInfoDto[];
}
