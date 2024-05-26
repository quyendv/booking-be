import { ForbiddenError } from '@casl/ability';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { In } from 'typeorm';
import { AbilityFactory } from '~/auth/abilities/ability.factory';
import { Roles } from '~/auth/decorators/role.decorator';
import { AuthUser, GetAccountInfo, GetUser } from '~/auth/decorators/user.decorator';
import { AuthGuard } from '~/auth/guards/auth.guard';
import { RolesGuard } from '~/auth/guards/role.guard';
import { UserPayload } from '~/auth/types/request.type';
import { PermissionActions } from '~/auth/types/role.type';
import { BaseResponse } from '~/base/types/response.type';
import { HotelService } from '~/hotels/hotel.service';
import { RoleTypes } from '~/users/constants/user.constant';
import { AccountInfo } from '~/users/types/user.type';
import { CreateReceptionistDto } from './dtos/create-receptionist.dto';
import {
  HotelReceptionistDto,
  ListReceptionistQueryDto,
  ReceptionistInfoDto,
} from './dtos/list-receptionist.dto';
import { UpdateReceptionistDto } from './dtos/update-receptionist.dto';
import { ReceptionistEntity } from './entities/receptionist.entity';
import { ReceptionistService } from './receptionist.service';

@ApiTags('Receptionists')
@Controller('receptionists')
@UseGuards(AuthGuard, RolesGuard)
export class ReceptionistController {
  constructor(
    private readonly receptionistService: ReceptionistService,
    private readonly abilityService: AbilityFactory,
    private readonly hotelService: HotelService,
  ) {}

  @Get('me')
  async getCurrentInfo(@AuthUser() user: UserPayload): Promise<ReceptionistInfoDto> {
    // const ability = await this.abilityService.getAbilityByEmail(user.email);
    // ForbiddenError.from(ability)
    //   .setMessage('Owner Receptionist, HotelManager or Admin can get current info.')
    //   .throwUnlessCan(
    //     PermissionActions.GET,
    //     this.receptionistService._createInstance({ id: user.email }),
    //   );

    const response = await this.receptionistService.getReceptionistById(user.email);
    return plainToInstance(ReceptionistInfoDto, response);
  }

  @Post()
  // @UseInterceptors(ClassSerializerInterceptor)
  async createReceptionist(
    @Body() dto: CreateReceptionistDto,
    @AuthUser() user: UserPayload,
  ): Promise<ReceptionistEntity> {
    const ability = await this.abilityService.getAbilityByEmail(user.email);
    ForbiddenError.from(ability)
      .setMessage('Admin or Owner Hotel can create receptionist.')
      .throwUnlessCan(
        PermissionActions.CREATE,
        this.receptionistService._createInstance({ id: dto.email, hotelId: dto.hotelId }),
      );
    return this.receptionistService.createReceptionist(dto);
  }

  @Patch() // :id
  // @UseInterceptors(ClassSerializerInterceptor)
  async updateReceptionist(
    @Body() dto: UpdateReceptionistDto,
    @AuthUser() user: UserPayload,
  ): Promise<ReceptionistEntity> {
    const ability = await this.abilityService.getAbilityByEmail(user.email);
    ForbiddenError.from(ability)
      .setMessage('Admin or Owner Hotel can update receptionist.')
      .throwUnlessCan(
        PermissionActions.CREATE,
        this.receptionistService._createInstance({ id: dto.email }),
      );
    return this.receptionistService.updateReceptionist(dto);
  }

  @Delete()
  async deleteReceptionist(
    @Query('email') email: string,
    @AuthUser() user: UserPayload,
  ): Promise<BaseResponse> {
    const ability = await this.abilityService.getAbilityByEmail(user.email);
    ForbiddenError.from(ability)
      .setMessage('Admin or Owner Hotel can delete receptionist.')
      .throwUnlessCan(
        PermissionActions.DELETE,
        this.receptionistService._createInstance({ id: email }),
      );
    return this.receptionistService.deleteReceptionist(email);
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles([PermissionActions.LIST, ReceptionistEntity])
  async listReceptionists(
    @Query() query: ListReceptionistQueryDto,
    @GetAccountInfo() user: AccountInfo,
  ): Promise<HotelReceptionistDto[]> {
    if (user.role === RoleTypes.HOTEL_MANAGER) {
      query.hotelIds = [+user.id];
    }

    const response = await this.hotelService._findAll({
      ...(query.hotelIds && { where: { id: In(query.hotelIds) } }),
      relations: { receptionists: { user: true }, address: false },
    });
    return response.map((hotel) => ({
      id: hotel.id,
      name: hotel.name,
      email: hotel.email,
      receptionists: plainToInstance(ReceptionistInfoDto, hotel.receptionists),
    }));
  }
}
