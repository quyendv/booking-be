import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '~/base/a.base.service';
import { RoomEntity } from '../entities/room.entity';

@Injectable()
export class RoomService extends BaseService<RoomEntity> {
  constructor(@InjectRepository(RoomEntity) repository: Repository<RoomEntity>) {
    super(repository);
  }
}
