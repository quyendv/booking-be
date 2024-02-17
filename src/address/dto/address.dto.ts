import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddressDto {
  @IsNotEmpty()
  @IsString()
  details: string;

  @IsNotEmpty()
  @IsString()
  ward: string;

  @IsNotEmpty()
  @IsString()
  district: string;

  @IsNotEmpty()
  @IsString()
  province: string;

  @IsNotEmpty()
  @IsString()
  country: string;
}

export class OptionalAddressDto extends PartialType(AddressDto) {}
