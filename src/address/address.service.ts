import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '~/base/a.base.service';
import { AddressEntity } from './entities/address.entity';

@Injectable()
export class AddressService extends BaseService<AddressEntity> {
  constructor(
    @InjectRepository(AddressEntity) private readonly repository: Repository<AddressEntity>,
  ) {
    super(repository);
  }
}
