import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Redirect,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Public } from '~/auth/decorators/public.decorator';
import { Roles } from '~/auth/decorators/role.decorator';
import { AuthUser, GetUser } from '~/auth/decorators/user.decorator';
import { AuthGuard } from '~/auth/guards/auth.guard';
import { RolesGuard } from '~/auth/guards/role.guard';
import { UserPayload } from '~/auth/types/request.type';
import { PermissionActions } from '~/auth/types/role.type';
import { BaseResponse } from '~/base/types/response.type';
import { UserEntity } from '~/users/entities/user.entity';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dtos/create-booking.dto';
import { CreatePaymentUrlDto } from './dtos/create-payment-url.dto';
import { BookingEntity } from './entities/booking.entity';
import { PaymentService } from './sub-service/payment.service';
import { UpdateBookingDto } from './dtos/update-booking.dto';
import { AbilityFactory } from '~/auth/abilities/ability.factory';

@ApiTags('Bookings')
@Controller('bookings')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard, RolesGuard)
export class BookingController {
  constructor(
    private readonly bookingService: BookingService,
    private readonly paymentService: PaymentService,
    private readonly abilityService: AbilityFactory,
  ) {}

  @Get()
  @Roles([PermissionActions.LIST, BookingEntity])
  listMyBookings(@GetUser() user: UserEntity): Promise<BookingEntity[]> {
    return this.bookingService.listMyBookings(user);
  }

  @Post()
  @Roles([PermissionActions.CREATE, BookingEntity])
  createBooking(
    @AuthUser() user: UserPayload,
    @Body() body: CreateBookingDto,
  ): Promise<BookingEntity> {
    return this.bookingService.createBooking(body, user.email);
  }

  @Patch(':id')
  @Roles([PermissionActions.UPDATE, BookingEntity])
  async updateBooking(
    @Param('id') id: string,
    @AuthUser() user: UserPayload,
    @Body() body: UpdateBookingDto,
  ): Promise<BaseResponse> {
    const ability = await this.abilityService.getAbilityByEmail(user.email);
    return this.bookingService.updateBooking(id, body, ability);
  }

  // @Redirect() // error CORS
  @Post('payment/vnpay')
  @Roles([PermissionActions.UPDATE, BookingEntity])
  createVnpayPaymentURL(
    @Req() req: Request,
    @Body() body: CreatePaymentUrlDto,
  ): Promise<BaseResponse<string>> {
    return this.paymentService.createVnpayPaymentURL(req, body);
  }

  @Redirect()
  @Public()
  @Get('payment/return/vnpay')
  async vnpayPaymentResult(@Req() req: Request): Promise<{ url: string }> {
    return this.paymentService.vnpayPaymentResult(req);
  }
}
