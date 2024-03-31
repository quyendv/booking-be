import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  ValidateNested,
} from 'class-validator';
import { AddressDto } from '~/address/dto/address.dto';
import { Validator } from '~/base/constants/validator.constant';

export class TimeRangeDto {
  @IsOptional()
  @Matches(Validator.Time.REGEX, { message: Validator.Time.message('start') })
  start: string;

  @IsOptional()
  @Matches(Validator.Time.REGEX, { message: Validator.Time.message('end') })
  end: string;
}

export class TimeRulesDto {
  @IsOptional()
  @IsNumber()
  timezone = 7;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => TimeRangeDto)
  checkIn: TimeRangeDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => TimeRangeDto)
  checkOut: TimeRangeDto;
}

export class GalleryItemDto {
  @IsNotEmpty()
  @IsUrl()
  url: string;

  @IsOptional()
  @IsString()
  key?: string;
}

export class CreateHotelDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsUrl()
  imageUrl: string;

  @IsOptional()
  @IsString()
  imageKey: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => GalleryItemDto)
  gallery?: GalleryItemDto[];

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  @IsOptional()
  @IsBoolean()
  gym: boolean;

  @IsOptional()
  @IsBoolean()
  bar: boolean;

  @IsOptional()
  @IsBoolean()
  restaurant: boolean;

  @IsOptional()
  @IsBoolean()
  freeParking: boolean;

  @IsOptional()
  @IsBoolean()
  movieNight: boolean;

  @IsOptional()
  @IsBoolean()
  coffeeShop: boolean;

  @IsOptional()
  @IsBoolean()
  spa: boolean;

  @IsOptional()
  @IsBoolean()
  laundry: boolean;

  @IsOptional()
  @IsBoolean()
  shopping: boolean;

  @IsOptional()
  @IsBoolean()
  bikeRental: boolean;

  @IsOptional()
  @IsBoolean()
  swimmingPool: boolean;

  @IsOptional()
  @IsBoolean()
  allowPets: boolean;

  @IsOptional()
  @IsBoolean()
  allowSmoking: boolean;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => TimeRulesDto)
  timeRules: TimeRulesDto;
}
