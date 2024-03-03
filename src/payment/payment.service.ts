import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { Request } from 'express';
import * as qs from 'qs';
import { BaseResponse } from '~/base/types/response.type';
import { DateUtils } from '~/base/utils/date.utils';
import { PaymentUtils } from './utils/payment.utils';

@Injectable()
export class PaymentService {
  constructor(private readonly configService: ConfigService) {}

  createPayment(req: Request): BaseResponse<string> {
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
      vnp_ReturnUrl: `${serverURL}/payment/vnpay/return`,
      vnp_Api: 'https://sandbox.vnpayment.vn/merchant_webapi/api/transaction',
    };

    const tmnCode = config.vnp_TmnCode;
    const secretKey = config.vnp_HashSecret;
    let vnpUrl = config.vnp_Url;
    const returnUrl = config.vnp_ReturnUrl;
    const orderId = createDate; // moment(date).format('DDHHmmss');
    const amount = 10000;
    // const bankCode = req.body?.bankCode;
    const bankCode = req.body?.bankCode ?? '';

    // let locale = req.body?.language;
    let locale = req.body?.language ?? '';
    if (locale === null || locale === '') {
      locale = 'vn';
    }

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
    if (bankCode !== null && bankCode !== '') {
      vnp_Params['vnp_BankCode'] = bankCode;
    }

    console.log({ beforeCreateParams: vnp_Params });
    vnp_Params = PaymentUtils.sortAndEncodeObject(vnp_Params);
    console.log({ afterCreateParams: vnp_Params });

    const signData = qs.stringify(vnp_Params, { encode: false });
    console.log({ signData });

    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + qs.stringify(vnp_Params, { encode: false });

    console.log({ vnpUrl });

    // return { url: vnpUrl }; // for redirect
    return { status: 'success', data: vnpUrl };
  }
}
