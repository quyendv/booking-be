import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class FullyAddressDto {
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

// export class AddressDto extends PartialType(FullyAddressDto) {}
export class AddressDto {
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
