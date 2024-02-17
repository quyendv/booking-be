import {
  IsEmail,
  IsEnum,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { UpdateAddressDto } from '~/address/dto/address.dto';
import { Validator } from '~/base/constants/validator.constant';
import { GenderTypes } from '../constants/customer.constant';
import { Type } from 'class-transformer';

export class UpdateCustomerDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @Matches(Validator.Date.REGEX, { message: Validator.Date.message('birthday') })
  birthday?: string;

  @IsOptional()
  @IsMobilePhone()
  phone?: string;

  @IsOptional()
  @IsEnum(GenderTypes)
  gender?: GenderTypes;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateAddressDto)
  address?: UpdateAddressDto;
}