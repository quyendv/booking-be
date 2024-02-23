import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageModule } from '~/storage/storage.module';
import { HotelEntity } from './entities/hotel.entity';
import { HotelController } from './hotel.controller';
import { HotelService } from './hotel.service';
import { RoomEntity } from './entities/room.entity';
import { RoomService } from './sub-services/room.service';

@Module({
  imports: [TypeOrmModule.forFeature([HotelEntity, RoomEntity]), StorageModule],
  controllers: [HotelController],
  providers: [HotelService, RoomService],
  exports: [HotelService],
})
export class HotelModule {}