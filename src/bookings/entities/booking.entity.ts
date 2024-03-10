import { Expose } from 'class-transformer';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { UuidBaseEntity } from '~/base/a.base.entity';
import { ColumnNumericTransformer } from '~/base/transformers/numeric.transformer';
import { CustomerEntity } from '~/customers/entities/customer.entity';
import { HotelEntity } from '~/hotels/entities/hotel.entity';
import { RoomEntity } from '~/hotels/entities/room.entity';
import { BookingStatus, PaymentChannel, PaymentCurrency } from '../constants/booking.constant';
import { PaymentInfo } from '../payment.type';
import { ReviewEntity } from './review.entity';

@Entity('bookings')
export class BookingEntity extends UuidBaseEntity {
  @ManyToOne(() => RoomEntity, (room) => room.bookings, { nullable: false })
  @JoinColumn({ name: 'room_id' })
  room: RoomEntity;

  @ManyToOne(() => HotelEntity, (hotel) => hotel.bookings, { nullable: false })
  @JoinColumn({ name: 'hotel_id' })
  hotel: HotelEntity;

  @OneToOne(() => ReviewEntity, (review) => review.booking, { nullable: true })
  review: ReviewEntity;

  @ManyToOne(() => CustomerEntity, (customer) => customer.bookings, { nullable: false })
  @JoinColumn({ name: 'customer_id' })
  customer: CustomerEntity;

  @Column('varchar', { name: 'customer_name' })
  customerName: string;

  @Column('varchar', { name: 'hotel_owner_email' })
  hotelOwnerEmail: string;

  @Column('date', { name: 'start_date' })
  startDate: string;

  @Column('date', { name: 'end_date' })
  endDate: string;

  @Column('bool', { name: 'breakfast_included', default: false })
  breakFastIncluded: boolean;

  @Column('varchar', { name: 'currency', default: 'VND' })
  currency: PaymentCurrency;

  @Column('decimal', {
    name: 'total_price',
    precision: 14,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  totalPrice: number;

  @Column('bool', { name: 'is_paid', default: false })
  isPaid: boolean;

  @Column('varchar', { name: 'payment_channel' })
  paymentChannel: PaymentChannel;

  @Column('varchar', { name: 'payment_id', unique: true })
  paymentId: string; // Payment ID from payment gateway: payment_intent_id (stripe), order_id (vn_pay)

  @Column('jsonb', { name: 'payment_info', nullable: true })
  paymentInfo: PaymentInfo; // Payment info from payment gateway

  @Column('varchar', { name: 'status', default: BookingStatus.PENDING })
  status: string;

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP()',
    name: 'created_at',
  })
  @Expose({ name: 'createdAt' })
  createdAt: Date; // bookedAt - always expose

  // Foreign keys
  @Column('int', { name: 'room_id' })
  roomId: number;

  @Column('int', { name: 'hotel_id' })
  hotelId: number;

  @Column('varchar', { name: 'customer_id' })
  customerEmail: string; // id = email
}
