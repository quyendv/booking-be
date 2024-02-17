import { Injectable, NotFoundException } from '@nestjs/common';
import { CustomerEntity } from './entities/customer.entity';
import { BaseService } from '~/base/a.base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomerService extends BaseService<CustomerEntity> {
  constructor(@InjectRepository(CustomerEntity) repository: Repository<CustomerEntity>) {
    super(repository);
  }

  async updateInfo(dto: UpdateCustomerDto): Promise<CustomerEntity> {
    const customer = await this.findOne({ where: { id: dto.email } });
    if (!customer) throw new NotFoundException('Customer not found to update.');

    return this.updateOne(dto.email, {
      name: dto.name,
      birthday: dto.birthday,
      phone: dto.phone,
      gender: dto.gender,
      address: dto.address
        ? {
            id: customer.address_id | (undefined as any),
            details: dto.address.details,
            district: dto.address.district,
            province: dto.address.province,
            country: dto.address.country,
          }
        : undefined,
    });
  }
}
