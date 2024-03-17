import { IsEnum, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { Locales } from '~/base/constants/locale.constant';
import { VNPayBankCode } from '../constants/booking.constant';

export class CreatePaymentUrlDto {
  // @ApiProperty()
  @IsOptional()
  @IsEnum(VNPayBankCode)
  bankCode: string;

  @IsNotEmpty()
  @IsUUID()
  bookingId: string;

  @IsOptional()
  @IsEnum(Locales)
  locale: Locales = Locales.VN;
}
