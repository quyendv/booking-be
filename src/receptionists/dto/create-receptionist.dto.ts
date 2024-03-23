import { IsInt, IsNotEmpty } from 'class-validator';
import { CreateCustomerDto } from '~/customers/dto/create-customer.dto';

export class CreateReceptionistDto extends CreateCustomerDto {
  @IsNotEmpty()
  @IsInt()
  hotelId: number;
}
