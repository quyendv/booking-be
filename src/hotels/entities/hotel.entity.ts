import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { AddressEntity } from '~/address/entities/address.entity';
import { SequenceBaseEntity } from '~/base/a.base.entity';
import { GalleryItem } from '../types/gallery.type';
import { RoomEntity } from './room.entity';
import { BookingEntity } from '~/bookings/entities/booking.entity';
import { ReviewEntity } from '~/reviews/entities/review.entity';
import { ReceptionistEntity } from '~/receptionists/entities/receptionist.entity';
import { HotelManagerEntity } from './hotel-manager.entity';

@Entity('hotels')
export class HotelEntity extends SequenceBaseEntity {
  @OneToOne(() => HotelManagerEntity, { cascade: true, nullable: false })
  @JoinColumn({ name: 'manager_email' })
  manager: HotelManagerEntity;

  @Column('varchar', { name: 'manager_email', unique: true })
  email: string; // manager email

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

  @OneToMany(() => RoomEntity, (room) => room.hotel)
  rooms: RoomEntity[];

  @Column('jsonb', { array: false, name: 'gallery', default: [] })
  gallery: GalleryItem[];

  @Column('bool', { name: 'gym', default: false })
  gym: boolean;

  @Column('bool', { name: 'bar', default: false })
  bar: boolean;

  @Column('bool', { name: 'restaurant', default: false })
  restaurant: boolean;

  @Column('bool', { name: 'free_parking', default: false })
  freeParking: boolean;

  @Column('bool', { name: 'movie_night', default: false })
  movieNight: boolean;

  @Column('bool', { name: 'coffee_shop', default: false })
  coffeeShop: boolean;

  @Column('bool', { name: 'spa', default: false })
  spa: boolean;

  @Column('bool', { name: 'laundry', default: false })
  laundry: boolean;

  @Column('bool', { name: 'shopping', default: false })
  shopping: boolean;

  @Column('bool', { name: 'bike_rental', default: false })
  bikeRental: boolean;

  @Column('bool', { name: 'swimming_pool', default: false })
  swimmingPool: boolean;

  @OneToMany(() => BookingEntity, (booking) => booking.hotel)
  bookings: BookingEntity[];

  @OneToMany(() => ReviewEntity, (review) => review.hotel)
  reviews: ReviewEntity[];

  @OneToMany(() => ReceptionistEntity, (receptionist) => receptionist.hotel)
  receptionists: ReceptionistEntity[];
}
