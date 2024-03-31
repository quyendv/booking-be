import { ForbiddenError } from '@casl/ability';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { AppAbility, PermissionActions } from '~/auth/types/role.type';
import { BaseService } from '~/base/a.base.service';
import { BaseResponse } from '~/base/types/response.type';
import { CommonUtils } from '~/base/utils/common.utils';
import { CustomerService } from '~/customers/customer.service';
import { HotelService } from '~/hotels/hotel.service';
import { RoleTypes } from '~/users/constants/user.constant';
import { UserEntity } from '~/users/entities/user.entity';
import { BookingStatus, PaymentChannel } from './constants/booking.constant';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { BookingEntity } from './entities/booking.entity';

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

  async updateBooking(
    id: string,
    dto: UpdateBookingDto,
    ability: AppAbility,
  ): Promise<BaseResponse> {
    const booking = await this.findById(id);
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    ForbiddenError.from(ability)
      .setMessage('Admin or Owner Hotel/Customer can update booking.')
      .throwUnlessCan(PermissionActions.UPDATE, booking);

    if (dto.status) {
      // TODO: validate strictly (not allow 'reviewed', ...)
      const nextStatuses = CommonUtils.getNextEnumValues(BookingStatus, booking.status, true);
      if (!nextStatuses.includes(dto.status)) {
        throw new BadRequestException(`Cannot change from "${booking.status}" to "${dto.status}"`);
      }
    }

    const updateResult = await this.update(id, { ...dto });
    if (updateResult.affected && updateResult.affected > 0) {
      return {
        status: 'success',
        message: 'Update booking successfully',
      };
    } else {
      throw new InternalServerErrorException('Something went wrong.');
    }
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

    const hotel = await this.hotelService.getHotelById(dto.hotelId, { rooms: true });
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
      timeRules: hotel.timeRules,
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

  async listMyBookings(user: UserEntity): Promise<BookingEntity[]> {
    switch (user.roleName) {
      case RoleTypes.CUSTOMER:
        return this.findAll({
          where: { customerEmail: user.id },
          relations: { room: true, hotel: true, review: true },
        });
      case RoleTypes.HOTEL_MANAGER:
        return this.findAll({
          where: { hotelOwnerEmail: user.id },
          relations: { room: true, hotel: true, review: true },
        });
      case RoleTypes.RECEPTIONIST:
        const hotel = await this.hotelService.getReceptionistHotel(user.id);
        return this.findAll({
          where: { hotelId: hotel.id },
          relations: { room: true, hotel: true, review: true },
        });
      default:
        throw new ForbiddenException('Invalid user role');
    }
  }
}
