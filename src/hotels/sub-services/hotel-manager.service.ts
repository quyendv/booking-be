import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '~/base/a.base.service';
import { HotelManagerEntity } from '../entities/hotel-manager.entity';
import { UpdateHotelManagerDto } from '../dtos/update-hotel-manager.dto';

@Injectable()
export class HotelManagerService extends BaseService<HotelManagerEntity> {
  constructor(@InjectRepository(HotelManagerEntity) repository: Repository<HotelManagerEntity>) {
    super(repository);
  }

  async getHotelManagerByEmail(email: string): Promise<HotelManagerEntity> {
    const manager = await this.findOne({ where: { id: email } });
    if (!manager) throw new NotFoundException('Hotel Manager not found.');
    return manager;
  }

  async updateHotelManager(body: UpdateHotelManagerDto): Promise<HotelManagerEntity> {
    const manager = await this.findOne({ where: { id: body.email } });
    if (!manager) throw new NotFoundException('Hotel Manager not found to update.');

    const { email, ...data } = body;
    return this.updateOne(email, {
      ...data,
      address:
        body.address && manager.addressId
          ? { id: manager.addressId, ...body.address }
          : body.address,
    });
  }
}
