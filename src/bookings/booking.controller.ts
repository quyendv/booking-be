import { Body, Controller, Get, Post, Redirect, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Roles } from '~/auth/decorators/role.decorator';
import { AuthUser } from '~/auth/decorators/user.decorator';
import { AuthGuard } from '~/auth/guards/auth.guard';
import { RolesGuard } from '~/auth/guards/role.guard';
import { UserPayload } from '~/auth/types/request.type';
import { PermissionActions } from '~/auth/types/role.type';
import { BaseResponse } from '~/base/types/response.type';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingEntity } from './entities/booking.entity';
import { PaymentService } from './sub-service/payment.service';
import { Public } from '~/auth/decorators/public.decorator';
import { CreatePaymentUrlDto } from './dto/create-payment-url.dto';

@ApiTags('Bookings')
@Controller('bookings')
@UseGuards(AuthGuard, RolesGuard)
export class BookingController {
  constructor(
    private readonly bookingService: BookingService,
    private readonly paymentService: PaymentService,
  ) {}

  @Get()
  listBookings(): Promise<BookingEntity[]> {
    return this.bookingService.findAll();
  }

  @Post()
  @Roles([PermissionActions.CREATE, BookingEntity])
  createBooking(
    @AuthUser() user: UserPayload,
    @Body() body: CreateBookingDto,
  ): Promise<BookingEntity> {
    return this.bookingService.createBooking(body, user.email);
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
  async vnpayPaymentResult(@Req() req: Request) {
    const vnp_Params = req.query;

    console.log(vnp_Params['vnp_ResponseCode']);
    await new Promise((resolve) => setTimeout(resolve, 5000));
    return { url: `http://localhost:3000?code=${vnp_Params['vnp_ResponseCode']}` };

    // if (secureHash === signed) {
    //   //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua

    //   return { url: `localhost:3000?code=${vnp_Params['vnp_ResponseCode']}` };
    //   // res.render('success', { code: vnp_Params['vnp_ResponseCode'] });
    // } else {
    //   return { url: 'localhost:3000?code=97' };
    //   // res.render('success', { code: '97' });
    // }
    // return this.paymentService.vnpayPaymentResult(req);
  }
}
