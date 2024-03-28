import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '~/base/a.base.service';
import { HotelManagerEntity } from '../entities/hotel-manager.entity';

@Injectable()
export class HotelManagerService extends BaseService<HotelManagerEntity> {
  constructor(@InjectRepository(HotelManagerEntity) repository: Repository<HotelManagerEntity>) {
    super(repository);
  }
}
