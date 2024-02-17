import { ForbiddenError } from '@casl/ability';
import {
  Body,
  Controller,
  FileTypeValidator,
  ParseFilePipe,
  Patch,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AbilityFactory } from '~/auth/abilities/ability.factory';
import { AuthUser } from '~/auth/decorators/user.decorator';
import { AuthGuard } from '~/auth/guards/auth.guard';
import { RolesGuard } from '~/auth/guards/role.guard';
import { UserPayload } from '~/auth/types/request.type';
import { PermissionActions } from '~/auth/types/role.type';
import { CustomerService } from './customer.service';
import { UpdateCustomerAvatarDto, UpdateCustomerInfoDto } from './dto/update-customer.dto';
import { CustomerEntity } from './entities/customer.entity';

@Controller('customers')
@UseGuards(AuthGuard, RolesGuard)
export class CustomerController {
  constructor(
    private readonly customerService: CustomerService,
    private readonly ability: AbilityFactory,
  ) {}

  @Patch() // ':id'
  async updateInfo(
    @AuthUser() user: UserPayload,
    @Body() dto: UpdateCustomerInfoDto,
  ): Promise<CustomerEntity> {
    const ability = await this.ability.getAbilityByEmail(user.email);
    ForbiddenError.from(ability)
      .setMessage('Admin or Owner Customer can update info.')
      .throwUnlessCan(
        PermissionActions.UPDATE,
        this.customerService.createInstance({ id: dto.email }),
      );
    return this.customerService.updateInfo(dto);
  }

  @Put('avatar') // ':id/avatar'
  @UseInterceptors(FileInterceptor('file'))
  async updateAvatar(
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: true,
        validators: [new FileTypeValidator({ fileType: /.(jpe?g|png)$/i })],
      }),
    )
    file: Express.Multer.File,
    @AuthUser() user: UserPayload,
    @Body() dto: UpdateCustomerAvatarDto,
  ): Promise<CustomerEntity> {
    const ability = await this.ability.getAbilityByEmail(user.email);
    ForbiddenError.from(ability)
      .setMessage('Admin or Owner Customer can update info.')
      .throwUnlessCan(
        PermissionActions.UPDATE,
        this.customerService.createInstance({ id: dto.email }),
      );
    return this.customerService.updateAvatar(dto.email, file);
  }
}
