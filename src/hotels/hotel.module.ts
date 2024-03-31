import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageModule } from '~/storage/storage.module';
import { HotelEntity } from './entities/hotel.entity';
import { HotelController } from './hotel.controller';
import { HotelService } from './hotel.service';
import { RoomEntity } from './entities/room.entity';
import { RoomService } from './sub-services/room.service';
import { HotelManagerEntity } from './entities/hotel-manager.entity';
import { HotelManagerService } from './sub-services/hotel-manager.service';

@Module({
  imports: [TypeOrmModule.forFeature([HotelEntity, RoomEntity, HotelManagerEntity]), StorageModule],
  controllers: [HotelController],
  providers: [HotelService, RoomService, HotelManagerService],
  exports: [HotelService, RoomService, HotelManagerService],
})
export class HotelModule {}
