import { ForbiddenError } from '@casl/ability';
import { Body, Controller, Delete, Get, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AbilityFactory } from '~/auth/abilities/ability.factory';
import { AuthUser } from '~/auth/decorators/user.decorator';
import { AuthGuard } from '~/auth/guards/auth.guard';
import { RolesGuard } from '~/auth/guards/role.guard';
import { UserPayload } from '~/auth/types/request.type';
import { PermissionActions } from '~/auth/types/role.type';
import { CreateReceptionistDto } from './dto/create-receptionist.dto';
import { ListReceptionistQueryDto } from './dto/list-receptionist.dto';
import { UpdateReceptionistDto } from './dto/update-receptionist.dto';
import { ReceptionistEntity } from './entities/receptionist.entity';
import { ReceptionistService } from './receptionist.service';
import { DeleteResult } from 'typeorm';

@ApiTags('receptionists')
@Controller('receptionists')
@UseGuards(AuthGuard, RolesGuard)
export class ReceptionistController {
  constructor(
    private readonly receptionistService: ReceptionistService,
    private readonly abilityService: AbilityFactory,
  ) {}

  @Post()
  async createReceptionist(
    @Body() dto: CreateReceptionistDto,
    @AuthUser() user: UserPayload,
  ): Promise<ReceptionistEntity> {
    const ability = await this.abilityService.getAbilityByEmail(user.email);
    ForbiddenError.from(ability)
      .setMessage('Admin or Owner Hotel can create receptionist.')
      .throwUnlessCan(
        PermissionActions.CREATE,
        this.receptionistService.createInstance({ id: dto.email, hotelId: dto.hotelId }),
      );
    return this.receptionistService.createReceptionist(dto);
  }

  @Patch() // :id
  async updateReceptionist(
    @Body() dto: UpdateReceptionistDto,
    @AuthUser() user: UserPayload,
  ): Promise<ReceptionistEntity> {
    const ability = await this.abilityService.getAbilityByEmail(user.email);
    ForbiddenError.from(ability)
      .setMessage('Admin or Owner Hotel can update receptionist.')
      .throwUnlessCan(
        PermissionActions.CREATE,
        this.receptionistService.createInstance({ id: dto.email }),
      );
    return this.receptionistService.updateReceptionist(dto);
  }

  @Delete()
  async deleteReceptionist(
    @Query('email') email: string,
    @AuthUser() user: UserPayload,
  ): Promise<DeleteResult> {
    const ability = await this.abilityService.getAbilityByEmail(user.email);
    ForbiddenError.from(ability)
      .setMessage('Admin or Owner Hotel can delete receptionist.')
      .throwUnlessCan(
        PermissionActions.DELETE,
        this.receptionistService.createInstance({ id: email }),
      );
    return this.receptionistService.permanentDelete(email);
  }

  @Get()
  listReceptionists(@Query() query: ListReceptionistQueryDto): Promise<ReceptionistEntity[]> {
    return this.receptionistService.findAll({ where: { hotelId: query.hotelId } });
  }
}
