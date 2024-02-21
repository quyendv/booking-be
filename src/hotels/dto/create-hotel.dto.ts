import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { AddressDto } from '~/address/dto/address.dto';

export class CreateHotelDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  imageUrl: string;

  @IsNotEmpty()
  @IsString()
  imageKey: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  @IsNotEmpty()
  @IsBoolean()
  gym: boolean;

  @IsNotEmpty()
  @IsBoolean()
  bar: boolean;

  @IsNotEmpty()
  @IsBoolean()
  restaurant: boolean;

  @IsNotEmpty()
  @IsBoolean()
  freeParking: boolean;

  @IsNotEmpty()
  @IsBoolean()
  movieNight: boolean;

  @IsNotEmpty()
  @IsBoolean()
  coffeeShop: boolean;

  @IsNotEmpty()
  @IsBoolean()
  spa: boolean;

  @IsNotEmpty()
  @IsBoolean()
  laundry: boolean;

  @IsNotEmpty()
  @IsBoolean()
  shopping: boolean;

  @IsNotEmpty()
  @IsBoolean()
  bikeRental: boolean;

  @IsNotEmpty()
  @IsBoolean()
  swimmingPool: boolean;
}
