import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { Request } from 'express';
import * as qs from 'qs';
import { BaseResponse } from '~/base/types/response.type';
import { DateUtils } from '~/base/utils/date.utils';
import { PaymentUtils } from '../utils/payment.utils';
import { BookingService } from '../booking.service';
import { CreatePaymentUrlDto } from '../dtos/create-payment-url.dto';
import { DEFAULT_LOCALE } from '~/base/constants/locale.constant';

@Injectable()
export class PaymentService {
  constructor(
    private readonly configService: ConfigService,
    private readonly bookingService: BookingService,
  ) {}

  async createVnpayPaymentURL(
    req: Request,
    dto: CreatePaymentUrlDto,
  ): Promise<BaseResponse<string>> {
    const booking = await this.bookingService.getBookingById(dto.bookingId);

    const now = new Date();
    const createDate = DateUtils.formatDateToYYYYMMDDHHMMSS(now);

    const ipAddr =
      req.headers['x-forwarded-for'] ||
      req.socket.remoteAddress ||
      req.socket.remoteAddress ||
      req.socket.remoteAddress;

    const serverURL = `${req.protocol}://${req.get('host')}`;
    const config = {
      vnp_TmnCode: this.configService.getOrThrow<string>('environment.payment.vnp_TmnCode'),
      vnp_HashSecret: this.configService.getOrThrow<string>('environment.payment.vnp_HashSecret'),
      vnp_Url: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
      vnp_ReturnUrl: `${serverURL}/bookings/payment/return/vnpay`,
      vnp_Api: 'https://sandbox.vnpayment.vn/merchant_webapi/api/transaction',
    };

    const tmnCode = config.vnp_TmnCode;
    const secretKey = config.vnp_HashSecret;
    let vnpUrl = config.vnp_Url;
    const returnUrl = config.vnp_ReturnUrl;

    const orderId = booking.paymentId; // NOTE: can customize & save paymentId
    const amount = booking.totalPrice;

    const bankCode = dto.bankCode;
    const locale = dto.locale;

    const currCode = 'VND';
    let vnp_Params: any = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    if (bankCode) {
      vnp_Params['vnp_BankCode'] = bankCode;
    }

    vnp_Params = PaymentUtils.sortAndEncodeObject(vnp_Params);

    const signData = qs.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + qs.stringify(vnp_Params, { encode: false });

    return { status: 'success', data: vnpUrl };
  }

  async vnpayPaymentResult(req: Request): Promise<{ url: string }> {
    let vnp_Params = req.query;

    const originalQueryParams = <object>vnp_Params; // already decoded to json object // can parse with qs
    const secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = PaymentUtils.sortAndEncodeObject(vnp_Params);

    const config = {
      vnp_TmnCode: this.configService.getOrThrow<string>('environment.payment.vnp_TmnCode'),
      vnp_HashSecret: this.configService.getOrThrow<string>('environment.payment.vnp_HashSecret'),
      vnp_Url: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
      vnp_Api: 'https://sandbox.vnpayment.vn/merchant_webapi/api/transaction',
    };
    // const tmnCode = config.vnp_TmnCode;
    const secretKey = config.vnp_HashSecret;
    const orderId = <string>vnp_Params['vnp_TxnRef']; // paymentId

    const signData = qs.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    const resultUrl = `${this.configService.getOrThrow<string>(
      'environment.clientURL',
    )}/${DEFAULT_LOCALE}/book-room/result?channel=vn_pay`;
    let vnpayCode = vnp_Params['vnp_ResponseCode'];

    if (secureHash === signed) {
      const updateResult = await this.bookingService.update(
        { paymentId: orderId },
        { isPaid: true, paymentInfo: originalQueryParams },
      );

      if (updateResult.affected !== 1) vnpayCode = '100'; // custom: internal error, update failed
      // See more: https://sandbox.vnpayment.vn/apis/docs/bang-ma-loi/

      return { url: `${resultUrl}&code=${vnpayCode}` };
    } else {
      return { url: `${resultUrl}&code=97` };
    }
  }
}
