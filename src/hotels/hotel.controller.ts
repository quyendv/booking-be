import { Body, Controller, Get, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { HotelService } from './hotel.service';
import { AuthGuard } from '~/auth/guards/auth.guard';
import { RolesGuard } from '~/auth/guards/role.guard';
import { Roles } from '~/auth/decorators/role.decorator';
import { PermissionActions } from '~/auth/types/role.type';
import { HotelEntity } from './entities/hotel.entity';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { ApiTags } from '@nestjs/swagger';
import { RoomEntity } from './entities/room.entity';

@ApiTags('Hotels')
@Controller('hotels')
@UseGuards(AuthGuard, RolesGuard)
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  @Post()
  @Roles([PermissionActions.CREATE, HotelEntity])
  createHotel(@Body() body: CreateHotelDto): Promise<HotelEntity> {
    return this.hotelService.createOne(body);
  }

  @Patch(':id')
  @Roles([PermissionActions.UPDATE, HotelEntity])
  updateHotel(@Body() body: UpdateHotelDto, @Param('id') id: string): Promise<HotelEntity> {
    return this.hotelService.updateHotel(+id, body);
  }

  @Get(':id')
  @Roles([PermissionActions.GET, HotelEntity])
  getHotel(@Param('id') id: string): Promise<HotelEntity> {
    return this.hotelService.getHotelById(+id);
  }

  @Get()
  @Roles([PermissionActions.LIST, HotelEntity])
  listHotels(): Promise<HotelEntity[]> {
    return this.hotelService.findAll();
  }

  @Post(':id/rooms')
  @Roles([PermissionActions.CREATE, RoomEntity])
  createRoom(@Body() body: any, @Param('id') id: string): Promise<RoomEntity> {
    return this.hotelService.createRoom(+id, body);
  }

  @Patch(':id/rooms/:roomId')
  @Roles([PermissionActions.UPDATE, RoomEntity])
  updateRoom(
    @Body() body: any,
    // @Param('id') id: string,
    @Param('roomId') roomId: string,
  ): Promise<RoomEntity> {
    return this.hotelService.updateRoom(+roomId, body);
  }

  @Get(':id/rooms')
  @Roles([PermissionActions.LIST, RoomEntity])
  listRooms(@Param('id') id: string): Promise<RoomEntity[]> {
    return this.hotelService.listHotelRooms(+id);
  }

  @Get(':id/rooms/:roomId')
  @Roles([PermissionActions.READ, RoomEntity])
  getRoom(@Param('roomId') roomId: string): Promise<RoomEntity> {
    return this.hotelService.getHotelRoomById(+roomId);
  }
}
