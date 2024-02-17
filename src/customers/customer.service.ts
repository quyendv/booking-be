import { Injectable } from '@nestjs/common';
import { CustomerEntity } from './entities/customer.entity';
import { BaseService } from '~/base/a.base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CustomerService extends BaseService<CustomerEntity> {
  constructor(@InjectRepository(CustomerEntity) repository: Repository<CustomerEntity>) {
    super(repository);
  }
}
