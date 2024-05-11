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
import { AbilityFactory } from '~/auth/abilities/ability.factory';
import { Roles } from '~/auth/decorators/role.decorator';
import { AuthUser } from '~/auth/decorators/user.decorator';
import { AuthGuard } from '~/auth/guards/auth.guard';
import { RolesGuard } from '~/auth/guards/role.guard';
import { UserPayload } from '~/auth/types/request.type';
import { PermissionActions } from '~/auth/types/role.type';
import { BaseResponse } from '~/base/types/response.type';
import { UserEntity } from '~/users/entities/user.entity';
import { UserService } from '~/users/user.service';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { DeleteCustomerDto } from './dtos/delete-customer.dto';
import { CustomerInfoDto, ListCustomerQueryDto } from './dtos/list-customer.dto';
import { UpdateCustomerDto } from './dtos/update-customer.dto';
import { CustomerEntity } from './entities/customer.entity';

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
        this.customerService._createInstance({ id: dto.email }),
      );
    return this.customerService.updateCustomer(dto);
  }

  @Get('me')
  async getCurrentInfo(@AuthUser() user: UserPayload): Promise<CustomerInfoDto> {
    const ability = await this.ability.getAbilityByEmail(user.email);
    ForbiddenError.from(ability)
      .setMessage('Admin or Owner Customer can read info.')
      .throwUnlessCan(
        PermissionActions.UPDATE,
        this.customerService._createInstance({ id: user.email }),
      );
    const response = await this.customerService.getCustomerByEmail(user.email, {
      relations: { address: true, user: true },
    });
    return plainToInstance(CustomerInfoDto, response);
  }

  @Get()
  @Roles([PermissionActions.LIST, CustomerEntity])
  async listCustomers(@Query() query: ListCustomerQueryDto): Promise<CustomerInfoDto[]> {
    const response = await this.customerService._findAll({
      where: { user: { isVerified: query.isVerified } },
      relations: { address: true, user: true },
    });
    return plainToInstance(CustomerInfoDto, response) as any;
  }

  @Delete()
  async deleteCustomer(@Query() dto: DeleteCustomerDto): Promise<BaseResponse> {
    return this.customerService.deleteCustomer(dto.emails);
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
  //       this.customerService._createInstance({ id: dto.email }),
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
  //       this.customerService._createInstance({ id: dto.email }),
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
  //       this.customerService._createInstance({ id: dto.email }),
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
