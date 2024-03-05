import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { BaseService } from '~/base/a.base.service';
import { BookingEntity } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { HotelService } from '~/hotels/hotel.service';
import { CustomerService } from '~/customers/customer.service';
import { PaymentChannel } from './constants/booking.constant';
import { CommonUtils } from '~/base/utils/common.utils';

@Injectable()
export class BookingService extends BaseService<BookingEntity> {
  constructor(
    @InjectRepository(BookingEntity) repository: Repository<BookingEntity>,
    private readonly hotelService: HotelService,
    private readonly customerService: CustomerService,
  ) {
    super(repository);
  }

  async getBookingById(id: string, isPaid?: boolean): Promise<BookingEntity> {
    const booking = await this.findById(id);
    if (!booking) {
      throw new NotFoundException(`Booking ${id} not found`);
    }
    if (isPaid !== undefined && booking.isPaid !== isPaid) {
      throw new ConflictException(`Booking payment status is ${isPaid ? 'paid' : 'unpaid'}`);
    }
    return booking;
  }

  async getBookingByPaymentId(paymentId: string): Promise<BookingEntity> {
    const booking = await this.findOne({ where: { paymentId } });
    if (!booking) {
      throw new NotFoundException(`Booking with paymentId ${paymentId} not found`);
    }
    return booking;
  }

  async createBooking(dto: CreateBookingDto, customerEmail: string): Promise<BookingEntity> {
    // TODO: validate start, end date; total price

    const existingBooking = await this.findOne({
      where: {
        hotelId: dto.hotelId,
        roomId: dto.roomId,
        customerEmail: customerEmail,
        startDate: MoreThanOrEqual(dto.startDate),
        endDate: LessThanOrEqual(dto.endDate),
      },
    });
    if (existingBooking) {
      throw new BadRequestException('Booking already exists for the given date range');
    }

    const hotel = await this.hotelService.getHotelById(dto.hotelId);
    const room = hotel.rooms.find((r) => r.id === dto.roomId);
    if (!room) {
      throw new NotFoundException(`Room ${dto.roomId} not found`);
    }
    const customer = await this.customerService.getCustomerByEmail(customerEmail);

    const paymentId = this.generatePaymentId(dto.paymentChannel, customerEmail);
    const booking = await this.createOne({
      ...dto,
      customerEmail,
      customerName: customer.name,
      hotelOwnerEmail: hotel.email,
      isPaid: false,
      paymentId,
    });

    return booking;
  }

  private generatePaymentId(paymentChannel: PaymentChannel, customerEmail: string): string {
    if (paymentChannel === PaymentChannel.VN_PAY) {
      return `${paymentChannel}_${CommonUtils.getEmailName(customerEmail)}_${Date.now()}`;
    } else {
      throw new BadRequestException('Invalid payment channel');
    }
  }
}
