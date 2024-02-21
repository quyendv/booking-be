import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { AddressEntity } from '~/address/entities/address.entity';
import { SequenceBaseEntity } from '~/base/a.base.entity';

@Entity('hotels')
export class HotelEntity extends SequenceBaseEntity {
  @Column('varchar', { name: 'name', length: 255 })
  name: string;

  @Column('varchar', { name: 'description' })
  description: string;

  @Column('varchar', { name: 'image_url' })
  imageUrl: string;

  @Column('varchar', { name: 'image_key', nullable: true })
  imageKey: string;

  @OneToOne(() => AddressEntity, { eager: true, cascade: true, nullable: false })
  @JoinColumn({ name: 'address_id' })
  address: AddressEntity;

  @Column('bool', { name: 'gym' })
  gym: boolean;

  @Column('bool', { name: 'bar' })
  bar: boolean;

  @Column('bool', { name: 'restaurant' })
  restaurant: boolean;

  @Column('bool', { name: 'free_parking' })
  freeParking: boolean;

  @Column('bool', { name: 'movie_night' })
  movieNight: boolean;

  @Column('bool', { name: 'coffee_shop' })
  coffeeShop: boolean;

  @Column('bool', { name: 'spa' })
  spa: boolean;

  @Column('bool', { name: 'laundry' })
  laundry: boolean;

  @Column('bool', { name: 'shopping' })
  shopping: boolean;

  @Column('bool', { name: 'bike_rental' })
  bikeRental: boolean;

  @Column('bool', { name: 'swimming_pool' })
  swimmingPool: boolean;
}
