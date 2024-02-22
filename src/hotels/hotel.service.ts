import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '~/base/a.base.service';
import { StorageService } from '~/storage/storage.service';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { HotelEntity } from './entities/hotel.entity';

@Injectable()
export class HotelService extends BaseService<HotelEntity> {
  constructor(
    @InjectRepository(HotelEntity) private readonly repository: Repository<HotelEntity>,
    private readonly storageService: StorageService,
  ) {
    super(repository);
  }

  async getHotelById(id: number): Promise<HotelEntity> {
    const hotel = await this.findById(id);
    if (!hotel) throw new NotFoundException('Hotel not found');
    return hotel;
  }

  async updateHotel(id: number, data: UpdateHotelDto): Promise<HotelEntity> {
    const hotel = await this.getHotelById(id);

    if (data.imageUrl && hotel.imageKey) {
      await this.storageService.delete(hotel.imageKey);
    }

    return this.updateOne(id, {
      ...data,
      ...(data.address && {
        address: { ...data.address, id: hotel.address.id },
      }),
      ...(data.gallery && { gallery: data.gallery }),
    });
  }
}
