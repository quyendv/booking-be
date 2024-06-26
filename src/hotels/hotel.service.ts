import {
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, Repository } from 'typeorm';
import { BaseService } from '~/base/a.base.service';
import { BaseResponse } from '~/base/types/response.type';
import { StorageService } from '~/storage/storage.service';
import { RoleTypes } from '~/users/constants/user.constant';
import { UserEntity } from '~/users/entities/user.entity';
import { UserService } from '~/users/user.service';
import { CreateHotelDto } from './dtos/create-hotel.dto';
import { CreateRoomDto } from './dtos/create-room.dto';
import { UpdateHotelDto } from './dtos/update-hotel.dto';
import { UpdateRoomDto } from './dtos/update-room.dto';
import { HotelEntity } from './entities/hotel.entity';
import { RoomEntity } from './entities/room.entity';
import { RoomService } from './sub-services/room.service';
import { CommonUtils } from '~/base/utils/common.utils';

@Injectable()
export class HotelService extends BaseService<HotelEntity> {
  constructor(
    @InjectRepository(HotelEntity) repository: Repository<HotelEntity>,
    private readonly roomService: RoomService,
    @Inject(forwardRef(() => UserService)) private readonly userService: UserService,
    private readonly storageService: StorageService,
  ) {
    super(repository);
  }

  async createHotel(data: CreateHotelDto): Promise<HotelEntity> {
    const user = await this.userService.createUser({
      email: data.email,
      roleName: RoleTypes.HOTEL_MANAGER,
      isVerified: true,
      shouldCreateFirebaseUser: true,
    });
    return this._createOne({
      ...data,
      manager: { id: data.email, name: CommonUtils.getEmailName(data.email), userId: user.id },
    });
  }

  async getMyHotel(user: UserEntity): Promise<HotelEntity> {
    if (user.roleName === RoleTypes.HOTEL_MANAGER) {
      return this.getHotelByEmail(user.id, { rooms: true });
    }
    if (user.roleName === RoleTypes.RECEPTIONIST) {
      return this.getReceptionistHotel(user.id, { rooms: true });
    }
    throw new ForbiddenException('You are not allowed to access this resource');
  }

  async getReceptionistHotel(
    receptionistEmail: string,
    relations?: FindOptionsRelations<HotelEntity>,
  ): Promise<HotelEntity> {
    const hotel = await this._findOne({
      where: { receptionists: { id: receptionistEmail } },
      relations: relations,
    });
    if (!hotel) throw new NotFoundException('Hotel not found');
    return hotel;
  }

  async getHotelById(
    id: number,
    relations?: FindOptionsRelations<HotelEntity>,
  ): Promise<HotelEntity> {
    const hotel = await this._findById(id, { relations: relations });
    if (!hotel) throw new NotFoundException('Hotel not found');
    return hotel;
  }

  async getHotelByEmail(
    email: string,
    relations?: FindOptionsRelations<HotelEntity>,
  ): Promise<HotelEntity> {
    const hotel = await this._findOne({ where: { email }, relations: relations });
    if (!hotel) throw new NotFoundException('Hotel not found');
    return hotel;
  }

  async updateHotel(id: number, data: UpdateHotelDto): Promise<HotelEntity> {
    const hotel = await this.getHotelById(id);

    if (data.imageUrl && hotel.imageKey) {
      await this.storageService.delete(hotel.imageKey);
    }

    return this._updateOne(id, {
      ...data,
      ...(data.address && {
        address: { ...data.address, id: hotel.address.id },
      }),
      ...(data.gallery && { gallery: data.gallery }),
    });
  }

  async createRoom(hotelId: number, data: CreateRoomDto): Promise<RoomEntity> {
    await this.getHotelById(hotelId);
    return this.roomService._createOne({ ...data, hotelId });
  }

  async updateRoom(roomId: number, data: UpdateRoomDto): Promise<RoomEntity> {
    return this.roomService._updateOne(roomId, data);
  }

  async deleteRoom(roomId: number): Promise<BaseResponse> {
    const room = await this.roomService._findById(roomId);
    if (!room) throw new NotFoundException('Room not found');

    if (room.imageKey) await this.storageService.delete(room.imageKey);
    // TODO: remove gallery images

    try {
      const response = await this.roomService._permanentDelete(roomId);
      if (response.affected === 0) {
        return { status: 'failure', message: 'Delete failed. Check query again.' };
      }
      return { status: 'success', message: 'Room deleted successfully' };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async listHotelRooms(hotelId: number): Promise<RoomEntity[]> {
    return this.roomService._findAll({ where: { hotelId } });
  }

  async getHotelRoomById(roomId: number): Promise<RoomEntity> {
    const room = await this.roomService._findById(roomId);
    if (!room) throw new NotFoundException('Room not found');
    return room;
  }
}
