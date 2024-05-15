import { Exclude, Expose, Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
import { transformBoolean } from '~/base/transformers/dto.transformer';
import { CustomerEntity } from '../entities/customer.entity';

export class ListCustomerQueryDto {
  @IsOptional()
  @IsBoolean()
  @Transform(transformBoolean)
  isVerified?: boolean;
}

export class CustomerInfoDto extends CustomerEntity {
  @Exclude({ toPlainOnly: true })
  user: CustomerEntity['user'];

  @Expose()
  createdAt: Date;

  @Expose()
  get isVerified(): boolean {
    return !!this.user?.isVerified;
  }
}
