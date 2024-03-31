import { ProfileDto } from '~/base/dto/base.dto';

export class CreateCustomerDto extends ProfileDto {} // json

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
