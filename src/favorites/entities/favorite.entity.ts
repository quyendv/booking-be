import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { ABaseEntityWithoutTimestamp } from '~/base/a.base.entity';
import { CustomerEntity } from '~/customers/entities/customer.entity';
import { HotelEntity } from '~/hotels/entities/hotel.entity';

@Entity('favorites')
@Unique(['customer', 'hotel'])
@Index(['customer', 'hotel'])
export class FavoriteEntity extends ABaseEntityWithoutTimestamp {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => CustomerEntity, { nullable: false })
  @JoinColumn({ name: 'customer_id' })
  customer: CustomerEntity;

  @ManyToOne(() => HotelEntity, { nullable: false })
  @JoinColumn({ name: 'hotel_id' })
  hotel: HotelEntity;

  // Foreign Keys
  @Exclude({ toPlainOnly: true })
  @Column('varchar', { name: 'customer_id' })
  customerEmail: string;

  @Exclude({ toPlainOnly: true })
  @Column('int', { name: 'hotel_id' })
  hotelId: number;
}
