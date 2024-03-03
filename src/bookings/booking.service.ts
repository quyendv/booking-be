import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '~/base/a.base.service';
import { BookingEntity } from './entities/booking.entity';

@Injectable()
export class BookingService extends BaseService<BookingEntity> {
  constructor(@InjectRepository(BookingEntity) repository: Repository<BookingEntity>) {
    super(repository);
  }
}
