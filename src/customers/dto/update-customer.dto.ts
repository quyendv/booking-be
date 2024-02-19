import { EmailDto } from '~/base/dto/base.dto';
import { CreateCustomerDto, CreateCustomerFormDataDto } from './create-customer.dto';

export class UpdateCustomerInfoDto extends CreateCustomerDto {}

export class UpdateCustomerAvatarDto extends EmailDto {}

export class UpdateCustomerDto extends CreateCustomerFormDataDto {}
