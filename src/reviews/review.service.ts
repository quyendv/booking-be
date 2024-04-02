import { ForbiddenError } from '@casl/ability';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppAbility, PermissionActions } from '~/auth/types/role.type';
import { BaseService } from '~/base/a.base.service';
import { BookingService } from '~/bookings/booking.service';
import { BookingStatus } from '~/bookings/constants/booking.constant';
import { CreateReviewDto } from '~/reviews/dtos/create-review.dto';
import { ReviewEntity } from './entities/review.entity';
import { UpdateReviewDto } from './dtos/update-review.dto';

@Injectable()
export class ReviewService extends BaseService<ReviewEntity> {
  constructor(
    @InjectRepository(ReviewEntity) repository: Repository<ReviewEntity>,
    private readonly bookingService: BookingService,
  ) {
    super(repository);
  }

  async createReview(dto: CreateReviewDto, ability: AppAbility): Promise<ReviewEntity> {
    const review = await this._findOne({ where: { bookingId: dto.bookingId } });
    if (review) {
      throw new BadRequestException(`Review for booking ${dto.bookingId} already exists`);
    }

    const booking = await this.bookingService._findById(dto.bookingId, {
      relations: { customer: true },
    });
    if (!booking) {
      throw new NotFoundException(`Booking ${dto.bookingId} not found`);
    }
    ForbiddenError.from(ability)
      .setMessage('Admin or Owner Booking can add reviews.')
      .throwUnlessCan(PermissionActions.CREATE, this._createInstance({ booking }));

    if (booking.status !== BookingStatus.CHECKED_OUT) {
      throw new BadRequestException(`Booking ${dto.bookingId} is not completed`);
    }

    const newReview = await this._createOne({
      ...dto,
      customerName: booking.customer.name,
      customerImage: booking.customer.avatar ?? undefined,
      customerEmail: booking.customer.id,
      hotelId: booking.hotelId,
      hotelOwnerEmail: booking.hotelOwnerEmail,
      roomId: booking.roomId,
    });

    const updateBookingResult = await this.bookingService._update(booking.id, {
      status: BookingStatus.REVIEWED,
    });
    if (!updateBookingResult.affected) {
      throw new InternalServerErrorException('Update booking failed.');
    }

    return newReview;
  }

  async updateReview(id: string, dto: UpdateReviewDto, ability: AppAbility): Promise<ReviewEntity> {
    const review = await this._findById(id);
    if (!review) {
      throw new NotFoundException(`Review ${id} not found`);
    }
    ForbiddenError.from(ability)
      .setMessage('Admin or Owner Review can update reviews.')
      .throwUnlessCan(PermissionActions.UPDATE, review);

    return this._updateOne(id, dto);
  }

  async listHotelReviews(hotelId: number): Promise<ReviewEntity[]> {
    return this._findAll({ where: { hotelId } });
  }

  async listRoomReviews(roomId: number): Promise<ReviewEntity[]> {
    return this._findAll({ where: { roomId } });
  }

  async listCustomerReviews(customerEmail: string): Promise<ReviewEntity[]> {
    return this._findAll({ where: { customerEmail } });
  }
}
