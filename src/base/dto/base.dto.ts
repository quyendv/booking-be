import { Type } from 'class-transformer';
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
import { AddressDto } from '~/address/dto/address.dto';
import { GenderTypes } from '~/customers/constants/customer.constant';
import { Validator } from '../constants/validator.constant';

export class EmailDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class ProfileDto extends EmailDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  avatarKey?: string;

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
  @Type(() => AddressDto)
  address?: AddressDto;
}
