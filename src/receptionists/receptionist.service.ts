import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '~/base/a.base.service';
import { ReceptionistEntity } from './entities/receptionist.entity';

@Injectable()
export class ReceptionistService extends BaseService<ReceptionistEntity> {
  constructor(@InjectRepository(ReceptionistEntity) repository: Repository<ReceptionistEntity>) {
    super(repository);
  }
}
