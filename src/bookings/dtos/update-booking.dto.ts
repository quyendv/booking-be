import { IsEnum, IsOptional } from 'class-validator';
import { BookingStatus } from '../constants/booking.constant';

export class UpdateBookingDto {
  @IsOptional()
  @IsEnum(BookingStatus)
  status: BookingStatus;
}
