import { Controller, Get, Post, Redirect, Req } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Request } from 'express';
import { BaseResponse } from '~/base/types/response.type';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  // @Redirect() // error CORS
  @Post('vnpay')
  createPayment(@Req() req: Request): BaseResponse<string> {
    return this.paymentService.createPayment(req);
  }

  @Get('vnpay/return')
  vnpayReturn(@Req() req: Request) {
    return req.query;
  }
}
