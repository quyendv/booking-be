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
  updateHotel(@Body() body: UpdateHotelDto, @Param('id') id: number): Promise<HotelEntity> {
    return this.hotelService.updateHotel(id, body);
  }

  @Get(':id')
  getHotel(@Param('id') id: number): Promise<HotelEntity> {
    return this.hotelService.getHotelById(id);
  }

  @Get()
  listHotels(): Promise<HotelEntity[]> {
    return this.hotelService.findAll();
  }
}
