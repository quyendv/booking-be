import { ForbiddenError } from '@casl/ability';
import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AbilityFactory } from '~/auth/abilities/ability.factory';
import { Roles } from '~/auth/decorators/role.decorator';
import { AuthUser } from '~/auth/decorators/user.decorator';
import { AuthGuard } from '~/auth/guards/auth.guard';
import { RolesGuard } from '~/auth/guards/role.guard';
import { UserPayload } from '~/auth/types/request.type';
import { PermissionActions } from '~/auth/types/role.type';
import { BaseResponse } from '~/base/types/response.type';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { HotelEntity } from './entities/hotel.entity';
import { RoomEntity } from './entities/room.entity';
import { HotelService } from './hotel.service';
import { RoomService } from './sub-services/room.service';
import { Public } from '~/auth/decorators/public.decorator';

@ApiTags('Hotels')
@Controller('hotels')
@UseGuards(AuthGuard, RolesGuard)
export class HotelController {
  constructor(
    private readonly hotelService: HotelService,
    private readonly roomService: RoomService,
    private readonly abilityService: AbilityFactory,
  ) {}

  @Post()
  @Roles([PermissionActions.CREATE, HotelEntity])
  createHotel(@Body() body: CreateHotelDto): Promise<HotelEntity> {
    return this.hotelService.createHotel(body);
  }

  @Get('me')
  @Roles([PermissionActions.READ, HotelEntity])
  getCurrentHotel(@AuthUser() user: UserPayload): Promise<HotelEntity> {
    return this.hotelService.getHotelByEmail(user.email);
  }

  @Patch(':id')
  @Roles([PermissionActions.UPDATE, HotelEntity])
  async updateHotel(
    @AuthUser() user: UserPayload,
    @Body() body: UpdateHotelDto,
    @Param('id') id: string,
  ): Promise<HotelEntity> {
    const ability = await this.abilityService.getAbilityByEmail(user.email);
    ForbiddenError.from(ability)
      .setMessage('Admin or Owner Hotel can update info.')
      .throwUnlessCan(PermissionActions.UPDATE, this.hotelService.createInstance({ id: +id }));
    return this.hotelService.updateHotel(+id, body);
  }

  @Get(':id')
  @Roles([PermissionActions.GET, HotelEntity])
  getHotel(@Param('id') id: string): Promise<HotelEntity> {
    return this.hotelService.getHotelById(+id, { bookings: true });
  }

  @Get()
  @Public()
  // @Roles([PermissionActions.LIST, HotelEntity])
  listHotels(): Promise<HotelEntity[]> {
    return this.hotelService.findAll({ relations: { rooms: true } });
  }

  @Post(':id/rooms')
  @Roles([PermissionActions.CREATE, RoomEntity])
  createRoom(@Body() body: CreateRoomDto, @Param('id') id: string): Promise<RoomEntity> {
    return this.hotelService.createRoom(+id, body);
  }

  @Patch(':id/rooms/:roomId')
  @Roles([PermissionActions.UPDATE, RoomEntity])
  async updateRoom(
    @AuthUser() user: UserPayload,
    @Body() body: UpdateRoomDto,
    // @Param('id') id: string,
    @Param('roomId') roomId: string,
  ): Promise<RoomEntity> {
    const ability = await this.abilityService.getAbilityByEmail(user.email);
    ForbiddenError.from(ability)
      .setMessage('Admin or Owner Hotel can update info.')
      .throwUnlessCan(PermissionActions.UPDATE, this.roomService.createInstance({ id: +roomId }));
    return this.hotelService.updateRoom(+roomId, body);
  }

  @Delete(':id/rooms/:roomId')
  @Roles([PermissionActions.DELETE, RoomEntity])
  async deleteRoom(
    @AuthUser() user: UserPayload,
    @Param('roomId') roomId: string,
  ): Promise<BaseResponse> {
    const ability = await this.abilityService.getAbilityByEmail(user.email);
    ForbiddenError.from(ability)
      .setMessage('Admin or Owner Hotel can delete info.')
      .throwUnlessCan(PermissionActions.DELETE, this.roomService.createInstance({ id: +roomId }));
    return this.hotelService.deleteRoom(+roomId);
  }

  @Get(':id/rooms/:roomId')
  @Roles([PermissionActions.READ, RoomEntity])
  getRoom(@Param('roomId') roomId: string): Promise<RoomEntity> {
    return this.hotelService.getHotelRoomById(+roomId);
  }

  @Get(':id/rooms')
  @Roles([PermissionActions.LIST, RoomEntity])
  listRooms(@Param('id') id: string): Promise<RoomEntity[]> {
    return this.hotelService.listHotelRooms(+id);
  }
}
