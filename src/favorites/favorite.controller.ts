import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '~/auth/decorators/role.decorator';
import { AuthUser } from '~/auth/decorators/user.decorator';
import { AuthGuard } from '~/auth/guards/auth.guard';
import { RolesGuard } from '~/auth/guards/role.guard';
import { UserPayload } from '~/auth/types/request.type';
import { PermissionActions } from '~/auth/types/role.type';
import { BaseResponse } from '~/base/types/response.type';
import { AddFavoriteHotelDto } from './dtos/add-favorite-hotel.dto';
import { FavoriteEntity } from './entities/favorite.entity';
import { FavoriteService } from './favorite.service';
import { HotelEntity } from '~/hotels/entities/hotel.entity';

@ApiTags('Favorites')
@Controller('favorites')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard, RolesGuard)
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Get('customers')
  @Roles([PermissionActions.LIST, FavoriteEntity])
  @SerializeOptions({})
  listFavoriteHotels(@AuthUser() user: UserPayload): Promise<HotelEntity[]> {
    return this.favoriteService.listFavoriteHotels(user.email);
  }

  @Post('customers')
  @Roles([PermissionActions.CREATE, FavoriteEntity])
  addFavoriteHotel(
    @AuthUser() user: UserPayload,
    @Body() body: AddFavoriteHotelDto,
  ): Promise<BaseResponse> {
    return this.favoriteService.addFavoriteHotel(user.email, body);
  }

  @Delete('customers/:hotelId')
  @Roles([PermissionActions.DELETE, FavoriteEntity])
  removeFavoriteHotel(
    @AuthUser() user: UserPayload,
    @Param('hotelId') hotelId: number,
  ): Promise<BaseResponse> {
    return this.favoriteService.removeFavoriteHotel(user.email, hotelId);
  }
}
