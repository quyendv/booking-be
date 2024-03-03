import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UuidBaseEntity } from '~/base/a.base.entity';
import { CustomerEntity } from '~/customers/entities/customer.entity';
import { HotelEntity } from '~/hotels/entities/hotel.entity';
import { RoomEntity } from '~/hotels/entities/room.entity';
import { PaymentChannel, PaymentCurrency } from '../constants/booking.constant';
import { ColumnNumericTransformer } from '~/base/transformers/numeric.transformer';

@Entity('bookings')
export class BookingEntity extends UuidBaseEntity {
  @ManyToOne(() => RoomEntity, (room) => room.bookings)
  @JoinColumn({ name: 'room_id' })
  room: RoomEntity;

  @ManyToOne(() => HotelEntity, (hotel) => hotel.bookings)
  @JoinColumn({ name: 'hotel_id' })
  hotel: HotelEntity;

  @ManyToOne(() => CustomerEntity, (customer) => customer.bookings)
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
  paymentInfo: any; // Payment info from payment gateway

  // bookingAt: string; // = createdAt

  // Foreign keys
  @Column('int', { name: 'room_id' })
  roomId: number;

  @Column('int', { name: 'hotel_id' })
  hotelId: number;

  @Column('varchar', { name: 'customer_id' })
  customerEmail: string; // id = email
}
