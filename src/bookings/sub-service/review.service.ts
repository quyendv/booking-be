import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '~/base/a.base.service';
import { ReviewEntity } from '../entities/review.entity';

@Injectable()
export class ReviewService extends BaseService<ReviewEntity> {
  constructor(@InjectRepository(ReviewEntity) repository: Repository<ReviewEntity>) {
    super(repository);
  }
}
