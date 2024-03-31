import { Transform } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsEmail, IsNotEmpty } from 'class-validator';
import { transformArray } from '~/base/transformers/dto.transformer';

export class DeleteCustomerDto {
  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @IsEmail({}, { each: true })
  @Transform(transformArray)
  emails: string[];
}
