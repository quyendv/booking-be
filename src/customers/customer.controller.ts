import { ForbiddenError } from '@casl/ability';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AbilityFactory } from '~/auth/abilities/ability.factory';
import { Roles } from '~/auth/decorators/role.decorator';
import { AuthUser } from '~/auth/decorators/user.decorator';
import { AuthGuard } from '~/auth/guards/auth.guard';
import { RolesGuard } from '~/auth/guards/role.guard';
import { UserPayload } from '~/auth/types/request.type';
import { PermissionActions } from '~/auth/types/role.type';
import { UserEntity } from '~/users/entities/user.entity';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerEntity } from './entities/customer.entity';
import { ListCustomerQueryDto } from './dto/list-customer.dto';
import { UserService } from '~/users/user.service';
import { In } from 'typeorm';

@ApiTags('Customers')
@Controller('customers')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard, RolesGuard)
export class CustomerController {
  constructor(
    private readonly customerService: CustomerService,
    private readonly userService: UserService,
    private readonly ability: AbilityFactory,
  ) {}

  @Post('test-account')
  @Roles([PermissionActions.CREATE, CustomerEntity])
  createTestAccount(@Body() body: CreateCustomerDto): Promise<UserEntity> {
    return this.customerService.createTestCustomerAccount(body);
  }

  @Patch() // ':id'
  async updateCustomer(
    @AuthUser() user: UserPayload,
    @Body() dto: UpdateCustomerDto,
  ): Promise<CustomerEntity> {
    const ability = await this.ability.getAbilityByEmail(user.email);
    ForbiddenError.from(ability)
      .setMessage('Admin or Owner Customer can update info.')
      .throwUnlessCan(
        PermissionActions.UPDATE,
        this.customerService.createInstance({ id: dto.email }),
      );
    return this.customerService.updateCustomer(dto);
  }

  @Get('me')
  async getCurrentInfo(@AuthUser() user: UserPayload): Promise<CustomerEntity> {
    const ability = await this.ability.getAbilityByEmail(user.email);
    ForbiddenError.from(ability)
      .setMessage('Admin or Owner Customer can read info.')
      .throwUnlessCan(
        PermissionActions.UPDATE,
        this.customerService.createInstance({ id: user.email }),
      );
    return this.customerService.getCustomerByEmail(user.email, { relations: { address: true } });
  }

  @Get()
  async listCustomers(@Query() query: ListCustomerQueryDto): Promise<CustomerEntity[]> {
    if (query.isVerified) {
      const users = await this.userService.findAll({ where: { isVerified: query.isVerified } });
      return this.customerService.findAll({ where: { id: In(users.map((user) => user.id)) } });
    }
    return this.customerService.findAll();
  }

  // @Patch('info') // ':id/info'
  // async updateInfo(
  //   @AuthUser() user: UserPayload,
  //   @Body() dto: UpdateCustomerInfoDto,
  // ): Promise<CustomerEntity> {
  //   const ability = await this.ability.getAbilityByEmail(user.email);
  //   ForbiddenError.from(ability)
  //     .setMessage('Admin or Owner Customer can update info.')
  //     .throwUnlessCan(
  //       PermissionActions.UPDATE,
  //       this.customerService.createInstance({ id: dto.email }),
  //     );
  //   return this.customerService.updateInfo(dto);
  // }

  // @Put('avatar') // ':id/avatar'
  // @UseInterceptors(FileInterceptor('file'))
  // async updateAvatar(
  //   @UploadedFile(
  //     new ParseFilePipe({
  //       fileIsRequired: true,
  //       validators: [new FileTypeValidator({ fileType: Validator.File.IMAGE_REGEX })],
  //     }),
  //   )
  //   file: Express.Multer.File,
  //   @AuthUser() user: UserPayload,
  //   @Body() dto: UpdateCustomerAvatarDto,
  // ): Promise<CustomerEntity> {
  //   const ability = await this.ability.getAbilityByEmail(user.email);
  //   ForbiddenError.from(ability)
  //     .setMessage('Admin or Owner Customer can update info.')
  //     .throwUnlessCan(
  //       PermissionActions.UPDATE,
  //       this.customerService.createInstance({ id: dto.email }),
  //     );
  //   return this.customerService.updateAvatar(dto.email, file);
  // }

  // @Patch() // ':id'
  // @UseInterceptors(FileInterceptor('file'))
  // async updateCustomer(
  //   @UploadedFile(
  //     new ParseFilePipe({
  //       fileIsRequired: false,
  //       validators: [new FileTypeValidator({ fileType: Validator.File.IMAGE_REGEX })],
  //     }),
  //   )
  //   file: Express.Multer.File,
  //   @AuthUser() user: UserPayload,
  //   @Body() dto: UpdateCustomerDto,
  // ): Promise<CustomerEntity> {
  //   const ability = await this.ability.getAbilityByEmail(user.email);
  //   ForbiddenError.from(ability)
  //     .setMessage('Admin or Owner Customer can update info.')
  //     .throwUnlessCan(
  //       PermissionActions.UPDATE,
  //       this.customerService.createInstance({ id: dto.email }),
  //     );
  //   return this.customerService.updateCustomer(dto, file);
  // }

  // @Post('test-account')
  // @Roles([PermissionActions.CREATE, CustomerEntity])
  // @UseInterceptors(FileInterceptor('file'))
  // createTestAccount(
  //   @UploadedFile(
  //     new ParseFilePipe({
  //       fileIsRequired: false,
  //       validators: [new FileTypeValidator({ fileType: Validator.File.IMAGE_REGEX })],
  //     }),
  //   )
  //   file: Express.Multer.File,
  //   @Body() body: CreateTestCustomerDto,
  // ): Promise<UserEntity> {
  //   return this.customerService.createTestAccount(body, file);
  // }
}
