import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '~/base/a.base.service';
import { FavoriteEntity } from './entities/favorite.entity';
import { AddFavoriteHotelDto } from './dtos/add-favorite-hotel.dto';
import { BaseResponse } from '~/base/types/response.type';
import { HotelEntity } from '~/hotels/entities/hotel.entity';

@Injectable()
export class FavoriteService extends BaseService<FavoriteEntity> {
  constructor(@InjectRepository(FavoriteEntity) repository: Repository<FavoriteEntity>) {
    super(repository);
  }

  async listFavoriteHotels(customerEmail: string): Promise<HotelEntity[]> {
    const response = await this._findAll({
      where: { customerEmail: customerEmail },
      relations: { hotel: true },
    });

    return response.map((favorite) => favorite.hotel);
  }

  async addFavoriteHotel(customerEmail: string, dto: AddFavoriteHotelDto): Promise<BaseResponse> {
    await this._upsert(
      dto.hotelIds.map((hotelId) => ({ hotelId, customerEmail })),
      { conflictPaths: { customerEmail: true, hotelId: true } },
    );
    return { status: 'success', message: 'Successfully added favorite hotels' };
  }

  async removeFavoriteHotel(customerEmail: string, hotelId: number): Promise<BaseResponse> {
    const response = await this._permanentDelete({ customerEmail, hotelId });
    if (response.affected === 0) {
      throw new NotFoundException('Favorite hotel not found');
    }
    return { status: 'success', message: 'Successfully removed favorite hotel' };
  }
}
