import { Type } from 'class-transformer';
import {
  IsEnum,
  IsMobilePhone,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { AddressDto } from '~/address/dto/address.dto';
import { Validator } from '~/base/constants/validator.constant';
import { EmailDto } from '~/base/dto/base.dto';
import { GenderTypes } from '../constants/customer.constant';

export class CreateCustomerDto extends EmailDto {
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
} // json

// export class CreateCustomerFormDataDto extends OmitType(CreateCustomerDto, ['address'] as const) {
//   @IsOptional()
//   @IsString()
//   country?: string;

//   @IsOptional()
//   @IsString()
//   province?: string;

//   @IsOptional()
//   @IsString()
//   district?: string;

//   @IsOptional()
//   @IsString()
//   ward?: string;

//   @IsOptional()
//   @IsString()
//   address_details?: string;

//   @IsOptional()
//   @ValidateNested()
//   @Type(() => AddressDto)
//   @Transform(({ obj }) => {
//     const dto = obj as CreateCustomerFormDataDto;
//     if (dto.country || dto.province /* || dto.district || dto.ward */ || dto.address_details) {
//       return {
//         country: dto.country,
//         province: dto.province,
//         district: dto.district,
//         ward: dto.ward,
//         details: dto.address_details,
//       };
//     }
//     return undefined;
//   })
//   address?: AddressDto = {} as any; // NOTE: need default value to transform
// } // multipart/form-data

// export class CreateTestCustomerDto extends CreateCustomerFormDataDto {
//   // @Transform(() => undefined) // unnecessary
//   // avatar?: string; // always undefined, defined here to keep type for typescript if using dto: CreateCustomerDto | CreateTestCustomerDto // or check avatar: 'avatar' in dto ? dto.avatar : undefined
//   // @Transform(() => undefined)
//   // avatarKey?: string;
// }
