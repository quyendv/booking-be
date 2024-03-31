import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
import { transformBoolean } from '~/base/transformers/dto.transformer';

export class ListCustomerQueryDto {
  @IsOptional()
  @IsBoolean()
  @Transform(transformBoolean)
  isVerified?: boolean;
}
