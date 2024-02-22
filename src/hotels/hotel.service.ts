import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '~/base/a.base.service';
import { StorageService } from '~/storage/storage.service';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { HotelEntity } from './entities/hotel.entity';
import { RoomService } from './sub-services/room.service';
import { RoomEntity } from './entities/room.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class HotelService extends BaseService<HotelEntity> {
  constructor(
    @InjectRepository(HotelEntity) private readonly repository: Repository<HotelEntity>,
    private readonly roomService: RoomService,
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

  async createRoom(hotelId: number, data: CreateRoomDto): Promise<RoomEntity> {
    await this.getHotelById(hotelId);
    return this.roomService.createOne({ ...data, hotelId });
  }

  async updateRoom(roomId: number, data: UpdateRoomDto): Promise<RoomEntity> {
    return this.roomService.updateOne(roomId, data);
  }

  async listHotelRooms(hotelId: number): Promise<RoomEntity[]> {
    return this.roomService.findAll({ where: { hotelId } });
  }

  async getHotelRoomById(roomId: number): Promise<RoomEntity> {
    const room = await this.roomService.findById(roomId);
    if (!room) throw new NotFoundException('Room not found');
    return room;
  }
}
