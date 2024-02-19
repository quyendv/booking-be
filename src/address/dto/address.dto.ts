import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

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

// export class OptionalAddressDto extends PartialType(AddressDto) {}
export class OptionalAddressDto {
  @IsNotEmpty()
  @IsString()
  details: string;

  @IsOptional()
  @IsString()
  ward: string;

  @IsOptional()
  @IsString()
  district: string;

  @IsNotEmpty()
  @IsString()
  province: string;

  @IsNotEmpty()
  @IsString()
  country: string;
}
