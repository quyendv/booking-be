import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { AddressDto } from '~/address/dto/address.dto';

export class CreateHotelDto {
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
}

export class GalleryItemDto {
  @IsNotEmpty()
  @IsUrl()
  url: string;

  @IsOptional()
  @IsString()
  key?: string;
}
