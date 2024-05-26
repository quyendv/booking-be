import { Exclude, Expose } from 'class-transformer';
import { HotelManagerEntity } from '../entities/hotel-manager.entity';

export class HotelManagerInfoDto extends HotelManagerEntity {
  @Exclude({ toPlainOnly: true })
  user: HotelManagerEntity['user'];

  @Expose()
  createdAt: Date;

  @Expose()
  get isVerified(): boolean {
    return !!this.user?.isVerified;
  }
}
