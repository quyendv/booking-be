import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { UuidBaseEntity } from '~/base/a.base.entity';
import { HotelEntity } from '~/hotels/entities/hotel.entity';
import { RoomEntity } from '~/hotels/entities/room.entity';
import { BookingEntity } from '../../bookings/entities/booking.entity';
import { CustomerEntity } from '~/customers/entities/customer.entity';
import { ColumnNumericTransformer } from '~/base/transformers/numeric.transformer';
import { Expose } from 'class-transformer';

@Entity({ name: 'reviews' })
export class ReviewEntity extends UuidBaseEntity {
  // Basic info
  @ManyToOne(() => HotelEntity, (hotel) => hotel.reviews, { nullable: false })
  @JoinColumn({ name: 'hotel_id' })
  hotel: HotelEntity;

  @ManyToOne(() => RoomEntity, (room) => room.reviews, { nullable: false })
  @JoinColumn({ name: 'room_id' })
  room: RoomEntity;

  @OneToOne(() => BookingEntity, (booking) => booking.review, { nullable: false })
  @JoinColumn({ name: 'booking_id' })
  booking: BookingEntity;

  @ManyToOne(() => CustomerEntity, (customer) => customer.reviews, { nullable: false })
  @JoinColumn({ name: 'customer_id' })
  customer: CustomerEntity;

  @Column('varchar', { name: 'customer_name' })
  customerName: string;

  @Column('varchar', { name: 'customer_image', nullable: true })
  customerImage: string;

  @Column('varchar', { name: 'hotel_owner_email' })
  hotelOwnerEmail: string;

  // Rating info
  @Column('decimal', {
    name: 'staff_rating',
    precision: 2,
    scale: 1,
    default: 0,
    transformer: new ColumnNumericTransformer(),
  })
  staffRating: number;

  @Column('decimal', {
    name: 'facility_rating',
    precision: 2,
    scale: 1,
    default: 0,
    transformer: new ColumnNumericTransformer(),
  })
  facilityRating: number;

  @Column('decimal', {
    name: 'cleanliness_rating',
    precision: 2,
    scale: 1,
    default: 0,
    transformer: new ColumnNumericTransformer(),
  })
  cleanlinessRating: number;

  @Column('decimal', {
    name: 'comfort_rating',
    precision: 2,
    scale: 1,
    default: 0,
    transformer: new ColumnNumericTransformer(),
  })
  comfortRating: number;

  @Column('decimal', {
    name: 'value_for_money_rating',
    precision: 2,
    scale: 1,
    default: 0,
    transformer: new ColumnNumericTransformer(),
  })
  valueForMoneyRating: number;

  @Column('decimal', {
    name: 'location_rating',
    precision: 2,
    scale: 1,
    default: 0,
    transformer: new ColumnNumericTransformer(),
  })
  locationRating: number;

  @Column('varchar', { name: 'comment', nullable: true })
  comment: string;

  @Expose({ name: 'total' })
  get total(): number {
    return (
      (this.staffRating +
        this.facilityRating +
        this.cleanlinessRating +
        this.comfortRating +
        this.valueForMoneyRating +
        this.locationRating) /
      6
    );
  }

  @Expose()
  createdAt: Date;

  // Foreign keys
  @Column('varchar', { name: 'booking_id' })
  bookingId: string;

  @Column('int', { name: 'room_id' })
  roomId: number;

  @Column('int', { name: 'hotel_id' })
  hotelId: number;

  @Column('varchar', { name: 'customer_id' })
  customerEmail: string; // id = email
}
