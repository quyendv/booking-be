import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { Locales } from '~/base/constants/locale.constant';

enum VNPayBankCode {
  VNPAYQR = 'VNPAYQR',
  VNBANK = 'VNBANK',
  INTCARD = 'INTCARD',
}

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
