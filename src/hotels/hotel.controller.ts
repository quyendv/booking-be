import { ForbiddenError } from '@casl/ability';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AbilityFactory } from '~/auth/abilities/ability.factory';
import { Public } from '~/auth/decorators/public.decorator';
import { Roles } from '~/auth/decorators/role.decorator';
import { AuthUser, GetUser } from '~/auth/decorators/user.decorator';
import { AuthGuard } from '~/auth/guards/auth.guard';
import { RolesGuard } from '~/auth/guards/role.guard';
import { UserPayload } from '~/auth/types/request.type';
import { PermissionActions } from '~/auth/types/role.type';
import { BaseResponse } from '~/base/types/response.type';
import { UserEntity } from '~/users/entities/user.entity';
import { CreateHotelDto } from './dtos/create-hotel.dto';
import { CreateRoomDto } from './dtos/create-room.dto';
import { UpdateHotelManagerDto } from './dtos/update-hotel-manager.dto';
import { UpdateHotelDto } from './dtos/update-hotel.dto';
import { UpdateRoomDto } from './dtos/update-room.dto';
import { HotelManagerEntity } from './entities/hotel-manager.entity';
import { HotelEntity } from './entities/hotel.entity';
import { RoomEntity } from './entities/room.entity';
import { HotelService } from './hotel.service';
import { HotelManagerService } from './sub-services/hotel-manager.service';
import { RoomService } from './sub-services/room.service';

@ApiTags('Hotels')
@Controller('hotels')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard, RolesGuard)
export class HotelController {
  constructor(
    private readonly hotelService: HotelService,
    private readonly roomService: RoomService,
    private readonly hotelManagerService: HotelManagerService,
    private readonly abilityService: AbilityFactory,
  ) {}

  @Patch('manager')
  // @Roles([PermissionActions.UPDATE, HotelManagerEntity])
  async updateHotelManager(
    @AuthUser() user: UserPayload,
    @Body() body: UpdateHotelManagerDto,
  ): Promise<HotelManagerEntity> {
    const ability = await this.abilityService.getAbilityByEmail(user.email);
    ForbiddenError.from(ability)
      .setMessage('Admin or Owner Hotel Manager can update info.')
      .throwUnlessCan(
        PermissionActions.UPDATE,
        this.hotelManagerService._createInstance({ id: body.email }),
      );
    return this.hotelManagerService.updateHotelManager(body);
  }

  @Post()
  @Roles([PermissionActions.CREATE, HotelEntity])
  createHotel(@Body() body: CreateHotelDto): Promise<HotelEntity> {
    return this.hotelService.createHotel(body);
  }

  @Get('me')
  @Roles([PermissionActions.READ, HotelEntity])
  getCurrentHotel(@GetUser() user: UserEntity): Promise<HotelEntity> {
    return this.hotelService.getMyHotel(user);
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
      .throwUnlessCan(PermissionActions.UPDATE, this.hotelService._createInstance({ id: +id }));
    return this.hotelService.updateHotel(+id, body);
  }

  @Get(':id')
  @Public()
  // @Roles([PermissionActions.GET, HotelEntity])
  getHotel(@Param('id') id: string): Promise<HotelEntity> {
    return this.hotelService.getHotelById(+id, { rooms: true, bookings: true, address: true });
  }

  @Get()
  @Public()
  // @Roles([PermissionActions.LIST, HotelEntity])
  @SerializeOptions({ groups: ['overview'] })
  listHotels(): Promise<HotelEntity[]> {
    return this.hotelService._findAll({ relations: { rooms: { bookings: true }, reviews: true } });
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
      .throwUnlessCan(PermissionActions.UPDATE, this.roomService._createInstance({ id: +roomId }));
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
      .throwUnlessCan(PermissionActions.DELETE, this.roomService._createInstance({ id: +roomId }));
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
