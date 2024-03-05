import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { Validator } from '~/base/constants/validator.constant';
import { PaymentChannel, PaymentCurrency } from '../constants/booking.constant';

export class CreateBookingDto {
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  roomId: number;

  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  hotelId: number;

  // @IsNotEmpty()
  // @IsEmail()
  // customerEmail: string;

  @IsNotEmpty()
  @IsString()
  @Matches(Validator.Date.REGEX, { message: Validator.Date.message('startDate') })
  startDate: string; // TODO: check greater than or equal to today

  @IsNotEmpty()
  @IsString()
  @Matches(Validator.Date.REGEX, { message: Validator.Date.message('endDate') })
  endDate: string;

  @IsNotEmpty()
  @IsBoolean()
  breakFastIncluded: boolean;

  @IsOptional()
  @IsEnum(PaymentCurrency)
  currency: PaymentCurrency = PaymentCurrency.VND;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  totalPrice: number;

  @IsNotEmpty()
  @IsEnum(PaymentChannel)
  paymentChannel: PaymentChannel;
}
