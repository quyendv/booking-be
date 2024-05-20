import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import * as admin from 'firebase-admin';
import { Locales } from '~/base/constants/locale.constant';
import { BaseResponse } from '~/base/types/response.type';
import { IEnvironmentConfig } from '~/configs/env.config';
import { MailerService } from '~/mailers/mailer.service';
import { UserEntity } from '~/users/entities/user.entity';
import { UserService } from '~/users/user.service';
import { UserPayload } from './types/request.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {}

  async authenticate(authToken: string | undefined): Promise<UserPayload> {
    if (!authToken) throw new BadRequestException('Missing Auth Token');

    const match = authToken.match(/^Bearer (.*)$/);
    if (!match || match.length < 2) {
      throw new UnauthorizedException('Invalid Bearer Token');
    }

    try {
      const tokenString = match[1];
      const decodedToken: admin.auth.DecodedIdToken = await admin.auth().verifyIdToken(tokenString);

      if (!decodedToken.email) {
        throw new UnauthorizedException('Token does not contain the user email'); // if provider is not google, email/password, ...
      }
      const userPayload: UserPayload = {
        // uid: decodedToken.uid,
        email: decodedToken.email,
        picture: decodedToken.picture,
        name: decodedToken.name,
      };
      return userPayload;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  async signIn(payload: UserPayload): Promise<UserEntity> {
    const user = await this.userService.getUserByEmail(payload.email);
    if (!user) {
      throw new UnauthorizedException(`User "${payload.email}" not found`);
    }
    return user;
  }

  async signUp(payload: UserPayload): Promise<BaseResponse> {
    const existingUser = await this.userService.getUserByEmail(payload.email);
    if (existingUser) {
      throw new UnauthorizedException(`User "${payload.email}" already exists`);
    }
    const emailContent = (await this.generateVerificationContent(payload)).content;
    await this.userService.createUnverifiedCustomer(payload);
    await this.sendVerificationEmail(payload.email, emailContent);
    return { status: 'success', message: 'Verification email sent' };
  }

  async verifyEmail(token: string): Promise<UserEntity> {
    const { jwtSecret } = <IEnvironmentConfig>this.configService.get('environment');
    try {
      const decodeToken = await this.jwtService.verifyAsync<UserPayload>(token, {
        secret: jwtSecret,
      });
      // if (decodeToken.email !== payload.email) {
      //   // NOTE: should save the token (hashed) to db and check equality
      //   throw new UnauthorizedException('Invalid token');
      // }
      return this.userService.verifyCustomer(decodeToken.email);
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Token expired. Please sign up again!');
      }
      throw error;
    }
  }

  async generateVerificationContent(
    payload: UserPayload,
  ): Promise<{ token: string; links: { vn: string; en: string }; content: string }> {
    const { clientURL, jwtSecret } = <IEnvironmentConfig>this.configService.get('environment');
    const token = await this.jwtService.signAsync(payload, { secret: jwtSecret, expiresIn: '2d' });
    const links = {
      vn: `${clientURL}/${Locales.VN}/verify-email?token=${token}`,
      en: `${clientURL}/${Locales.EN}/verify-email?token=${token}`,
    };

    return {
      token,
      links,
      content: this.getVerificationContent({
        vn: `${clientURL}/${Locales.VN}/verify-email?token=${token}`,
        en: `${clientURL}/${Locales.EN}/verify-email?token=${token}`,
      }),
    };
  }

  async sendVerificationEmail(email: string, content: string): Promise<void> {
    Logger.log(`Sending verification email to "${email}"`, 'Start');
    await this.mailerService.sendEmail({
      content,
      to: email,
      subject: '[Booking App] Verify Your Email Address',
    });
    Logger.log(`Verification email sent to "${email}"`, 'Done');
  }

  private getVerificationContent(links: { vn: string; en: string }): string {
    // prettier-ignore
    return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html dir="ltr"xmlns="http://www.w3.org/1999/xhtml"xmlns:o="urn:schemas-microsoft-com:office:office"lang="en"><head><meta charset="UTF-8"><meta content="width=device-width,initial-scale=1"name="viewport"><meta name="x-apple-disable-message-reformatting"><meta http-equiv="X-UA-Compatible"content="IE=edge"><meta content="telephone=no"name="format-detection"><title>Confirm Email</title><!--[if (mso 16)]><style type="text/css">     a {text-decoration: none;}     </style><![endif]--><!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--><!--[if gte mso 9]><xml> <o:OfficeDocumentSettings> <o:AllowPNG></o:AllowPNG> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml>
<![endif]--><style type="text/css">#outlook a{padding:0}.es-button{mso-style-priority:100!important;text-decoration:none!important}a[x-apple-data-detectors]{color:inherit!important;text-decoration:none!important;font-size:inherit!important;font-family:inherit!important;font-weight:inherit!important;line-height:inherit!important}.es-desk-hidden{display:none;float:left;overflow:hidden;width:0;max-height:0;line-height:0;mso-hide:all}@media only screen and (max-width:600px){a,ol li,p,ul li{line-height:150%!important}h1,h1 a,h2,h2 a,h3,h3 a{line-height:120%}h1{font-size:36px!important;text-align:left}h2{font-size:26px!important;text-align:left}h3{font-size:20px!important;text-align:left}.es-content-body h1 a,.es-footer-body h1 a,.es-header-body h1 a{font-size:36px!important;text-align:left}.es-content-body h2 a,.es-footer-body h2 a,.es-header-body h2 a{font-size:26px!important;text-align:left}.es-content-body h3 a,.es-footer-body h3 a,.es-header-body h3 a{font-size:20px!important;text-align:left}.es-menu td a{font-size:12px!important}.es-header-body a,.es-header-body ol li,.es-header-body p,.es-header-body ul li{font-size:14px!important}.es-content-body a,.es-content-body ol li,.es-content-body p,.es-content-body ul li{font-size:16px!important}.es-footer-body a,.es-footer-body ol li,.es-footer-body p,.es-footer-body ul li{font-size:14px!important}.es-infoblock a,.es-infoblock ol li,.es-infoblock p,.es-infoblock ul li{font-size:12px!important}[class=gmail-fix]{display:none!important}.es-m-txt-c,.es-m-txt-c h1,.es-m-txt-c h2,.es-m-txt-c h3{text-align:center!important}.es-m-txt-r,.es-m-txt-r h1,.es-m-txt-r h2,.es-m-txt-r h3{text-align:right!important}.es-m-txt-l,.es-m-txt-l h1,.es-m-txt-l h2,.es-m-txt-l h3{text-align:left!important}.es-m-txt-c img,.es-m-txt-l img,.es-m-txt-r img{display:inline!important}.es-button-border{display:inline-block!important}a.es-button,button.es-button{font-size:20px!important;display:inline-block!important}.es-adaptive table,.es-left,.es-right{width:100%!important}.es-content,.es-content table,.es-footer,.es-footer table,.es-header,.es-header table{width:100%!important;max-width:600px!important}.es-adapt-td{display:block!important;width:100%!important}.adapt-img{width:100%!important;height:auto!important}.es-m-p0{padding:0!important}.es-m-p0r{padding-right:0!important}.es-m-p0l{padding-left:0!important}.es-m-p0t{padding-top:0!important}.es-m-p0b{padding-bottom:0!important}.es-m-p20b{padding-bottom:20px!important}.es-hidden,.es-mobile-hidden{display:none!important}table.es-desk-hidden,td.es-desk-hidden,tr.es-desk-hidden{width:auto!important;overflow:visible!important;float:none!important;max-height:inherit!important;line-height:inherit!important}tr.es-desk-hidden{display:table-row!important}table.es-desk-hidden{display:table!important}td.es-desk-menu-hidden{display:table-cell!important}.es-menu td{width:1%!important}.esd-block-html table,table.es-table-not-adapt{width:auto!important}table.es-social{display:inline-block!important}table.es-social td{display:inline-block!important}.es-m-p5{padding:5px!important}.es-m-p5t{padding-top:5px!important}.es-m-p5b{padding-bottom:5px!important}.es-m-p5r{padding-right:5px!important}.es-m-p5l{padding-left:5px!important}.es-m-p10{padding:10px!important}.es-m-p10t{padding-top:10px!important}.es-m-p10b{padding-bottom:10px!important}.es-m-p10r{padding-right:10px!important}.es-m-p10l{padding-left:10px!important}.es-m-p15{padding:15px!important}.es-m-p15t{padding-top:15px!important}.es-m-p15b{padding-bottom:15px!important}.es-m-p15r{padding-right:15px!important}.es-m-p15l{padding-left:15px!important}.es-m-p20{padding:20px!important}.es-m-p20t{padding-top:20px!important}.es-m-p20r{padding-right:20px!important}.es-m-p20l{padding-left:20px!important}.es-m-p25{padding:25px!important}.es-m-p25t{padding-top:25px!important}.es-m-p25b{padding-bottom:25px!important}.es-m-p25r{padding-right:25px!important}.es-m-p25l{padding-left:25px!important}.es-m-p30{padding:30px!important}.es-m-p30t{padding-top:30px!important}.es-m-p30b{padding-bottom:30px!important}.es-m-p30r{padding-right:30px!important}.es-m-p30l{padding-left:30px!important}.es-m-p35{padding:35px!important}.es-m-p35t{padding-top:35px!important}.es-m-p35b{padding-bottom:35px!important}.es-m-p35r{padding-right:35px!important}.es-m-p35l{padding-left:35px!important}.es-m-p40{padding:40px!important}.es-m-p40t{padding-top:40px!important}.es-m-p40b{padding-bottom:40px!important}.es-m-p40r{padding-right:40px!important}.es-m-p40l{padding-left:40px!important}.es-desk-hidden{display:table-row!important;width:auto!important;overflow:visible!important;max-height:inherit!important}}@media screen and (max-width:384px){.mail-message-content{width:414px!important}}</style></head><body style="width:100%;font-family:arial,'helvetica neue',helvetica,sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0"><div dir="ltr"class="es-wrapper-color"lang="en"style="background-color:#fafafa"><!--[if gte mso 9]><v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t"> <v:fill type="tile" color="#fafafa"></v:fill> </v:background><![endif]--><table class="es-wrapper"width="100%"cellspacing="0"cellpadding="0"role="none"style="mso-table-lspace:0;mso-table-rspace:0;border-collapse:collapse;border-spacing:0;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;background-color:#fafafa"><tr><td valign="top"style="padding:0;Margin:0"><table cellpadding="0"cellspacing="0"class="es-content"align="center"role="none"style="mso-table-lspace:0;mso-table-rspace:0;border-collapse:collapse;border-spacing:0;table-layout:fixed!important;width:100%"><tr><td align="center"style="padding:0;Margin:0"><table bgcolor="#ffffff"class="es-content-body"align="center"cellpadding="0"cellspacing="0"role="none"style="mso-table-lspace:0;mso-table-rspace:0;border-collapse:collapse;border-spacing:0;background-color:#fff;width:600px"><tr><td align="left"style="Margin:0;padding-left:20px;padding-right:20px;padding-top:30px;padding-bottom:30px"><table cellpadding="0"cellspacing="0"width="100%"role="none"style="mso-table-lspace:0;mso-table-rspace:0;border-collapse:collapse;border-spacing:0"><tr><td align="center"valign="top"style="padding:0;Margin:0;width:560px"><table cellpadding="0"cellspacing="0"width="100%"role="presentation"style="mso-table-lspace:0;mso-table-rspace:0;border-collapse:collapse;border-spacing:0"><tr><td align="center"style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px;font-size:0"><img src="https://eitehrg.stripocdn.email/content/guids/CABINET_67e080d830d87c17802bd9b4fe1c0912/images/55191618237638326.png"alt style="display:block;border:0;outline:0;text-decoration:none;-ms-interpolation-mode:bicubic"width="100"height="72"></td></tr><tr><td align="center"class="es-m-txt-c"style="padding:0;Margin:0;padding-bottom:10px"><h1 style="Margin:0;line-height:46px;mso-line-height-rule:exactly;font-family:arial,'helvetica neue',helvetica,sans-serif;font-size:46px;font-style:normal;font-weight:700;color:#333">Confirm Your Email</h1></td></tr><tr><td align="center"class="es-m-p0r es-m-p0l"style="Margin:0;padding-top:5px;padding-bottom:5px;padding-left:40px;padding-right:40px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial,'helvetica neue',helvetica,sans-serif;line-height:21px;color:#333;font-size:14px">You’ve received this message because your email address has been registered with our site. Please click the button below to verify your email address and confirm that you are the owner of this account.</p></td></tr><tr><td align="center"style="padding:0;Margin:0;padding-bottom:5px;padding-top:10px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial,'helvetica neue',helvetica,sans-serif;line-height:21px;color:#333;font-size:14px">If you did not register with us, please disregard this email.</p></td></tr><tr><td align="center"style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px"><span class="es-button-border"style="border-style:solid;border-color:#2cb543;background:#5c68e2;border-width:0;display:inline-block;border-radius:6px;width:auto"><a href="${links.en}"class="es-button"target="_blank"style="mso-style-priority:100!important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;color:#fff;font-size:20px;padding:10px 30px 10px 30px;display:inline-block;background:#5c68e2;border-radius:6px;font-family:arial,'helvetica neue',helvetica,sans-serif;font-weight:400;font-style:normal;line-height:24px;width:auto;text-align:center;mso-padding-alt:0;mso-border-alt:10px solid #5c68e2;padding-left:30px;padding-right:30px">CONFIRM</a></span></td></tr><tr><td align="center"class="es-m-p0r es-m-p0l"style="Margin:0;padding-top:5px;padding-bottom:5px;padding-left:40px;padding-right:40px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial,'helvetica neue',helvetica,sans-serif;line-height:21px;color:#333;font-size:14px">Once confirmed, this email will be uniquely associated with your account.</p></td></tr></table></td></tr></table></td></tr></table></td></tr></table><table cellpadding="0"cellspacing="0"class="es-content"align="center"role="none"style="mso-table-lspace:0;mso-table-rspace:0;border-collapse:collapse;border-spacing:0;table-layout:fixed!important;width:100%"><tr><td align="center"style="padding:0;Margin:0"><table bgcolor="#ffffff"class="es-content-body"align="center"cellpadding="0"cellspacing="0"role="none"style="mso-table-lspace:0;mso-table-rspace:0;border-collapse:collapse;border-spacing:0;background-color:#fff;width:600px"><tr><td align="left"style="Margin:0;padding-left:20px;padding-right:20px;padding-top:30px;padding-bottom:30px"><table cellpadding="0"cellspacing="0"width="100%"role="none"style="mso-table-lspace:0;mso-table-rspace:0;border-collapse:collapse;border-spacing:0"><tr><td align="center"valign="top"style="padding:0;Margin:0;width:560px"><table cellpadding="0"cellspacing="0"width="100%"role="presentation"style="mso-table-lspace:0;mso-table-rspace:0;border-collapse:collapse;border-spacing:0"><tr><td align="center"style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px;font-size:0"><img src="https://eitehrg.stripocdn.email/content/guids/CABINET_67e080d830d87c17802bd9b4fe1c0912/images/55191618237638326.png"alt style="display:block;border:0;outline:0;text-decoration:none;-ms-interpolation-mode:bicubic"width="100"height="72"></td></tr><tr><td align="center"class="es-m-txt-c"style="padding:0;Margin:0;padding-bottom:10px"><h1 style="Margin:0;line-height:46px;mso-line-height-rule:exactly;font-family:arial,'helvetica neue',helvetica,sans-serif;font-size:46px;font-style:normal;font-weight:700;color:#333">Xác thực Email</h1></td></tr><tr><td align="center"class="es-m-p0r es-m-p0l"style="Margin:0;padding-top:5px;padding-bottom:5px;padding-left:40px;padding-right:40px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial,'helvetica neue',helvetica,sans-serif;line-height:21px;color:#333;font-size:14px">Bạn đã nhận được thông báo này vì địa chỉ email của bạn đã được đăng ký với trang web của chúng tôi. Vui lòng nhấp vào nút bên dưới để xác thực địa chỉ email của bạn và xác nhận rằng bạn là chủ sở hữu của tài khoản này.</p></td></tr><tr><td align="center"style="padding:0;Margin:0;padding-bottom:5px;padding-top:10px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial,'helvetica neue',helvetica,sans-serif;line-height:21px;color:#333;font-size:14px">Nếu bạn không đăng ký với chúng tôi, vui lòng bỏ qua email này.<br></p></td></tr><tr><td align="center"style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px"><span class="es-button-border"style="border-style:solid;border-color:#2cb543;background:#5c68e2;border-width:0;display:inline-block;border-radius:6px;width:auto"><a href="${links.vn}"class="es-button"target="_blank"style="mso-style-priority:100!important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;color:#fff;font-size:20px;padding:10px 30px 10px 30px;display:inline-block;background:#5c68e2;border-radius:6px;font-family:arial,'helvetica neue',helvetica,sans-serif;font-weight:400;font-style:normal;line-height:24px;width:auto;text-align:center;mso-padding-alt:0;mso-border-alt:10px solid #5c68e2;padding-left:30px;padding-right:30px">XÁC THỰC</a></span></td></tr><tr><td align="center"class="es-m-p0r es-m-p0l"style="Margin:0;padding-top:5px;padding-bottom:5px;padding-left:40px;padding-right:40px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial,'helvetica neue',helvetica,sans-serif;line-height:21px;color:#333;font-size:14px">Sau khi xác nhận, email này sẽ được liên kết duy nhất với tài khoản của bạn.<br></p></td></tr></table></td></tr></table></td></tr></table></td></tr></table><table cellpadding="0"cellspacing="0"class="es-footer"align="center"role="none"style="mso-table-lspace:0;mso-table-rspace:0;border-collapse:collapse;border-spacing:0;table-layout:fixed!important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top"><tr><td align="center"style="padding:0;Margin:0"><table class="es-footer-body"align="center"cellpadding="0"cellspacing="0"style="mso-table-lspace:0;mso-table-rspace:0;border-collapse:collapse;border-spacing:0;background-color:transparent;width:640px"role="none"><tr><td align="left"style="Margin:0;padding-top:20px;padding-bottom:20px;padding-left:20px;padding-right:20px"><table cellpadding="0"cellspacing="0"width="100%"role="none"style="mso-table-lspace:0;mso-table-rspace:0;border-collapse:collapse;border-spacing:0"><tr><td align="left"style="padding:0;Margin:0;width:600px"><table cellpadding="0"cellspacing="0"width="100%"role="presentation"style="mso-table-lspace:0;mso-table-rspace:0;border-collapse:collapse;border-spacing:0"><tr><td align="center"style="padding:0;Margin:0;padding-top:15px;padding-bottom:15px;font-size:0"><table cellpadding="0"cellspacing="0"class="es-table-not-adapt es-social"role="presentation"style="mso-table-lspace:0;mso-table-rspace:0;border-collapse:collapse;border-spacing:0"><tr><td align="center"valign="top"style="padding:0;Margin:0;padding-right:40px"><img title="Facebook"src="https://eitehrg.stripocdn.email/content/assets/img/social-icons/logo-black/facebook-logo-black.png"alt="Fb"width="32"height="32"style="display:block;border:0;outline:0;text-decoration:none;-ms-interpolation-mode:bicubic"></td><td align="center"valign="top"style="padding:0;Margin:0;padding-right:40px"><img title="Twitter"src="https://eitehrg.stripocdn.email/content/assets/img/social-icons/logo-black/twitter-logo-black.png"alt="Tw"width="32"height="32"style="display:block;border:0;outline:0;text-decoration:none;-ms-interpolation-mode:bicubic"></td><td align="center"valign="top"style="padding:0;Margin:0;padding-right:40px"><img title="Instagram"src="https://eitehrg.stripocdn.email/content/assets/img/social-icons/logo-black/instagram-logo-black.png"alt="Inst"width="32"height="32"style="display:block;border:0;outline:0;text-decoration:none;-ms-interpolation-mode:bicubic"></td><td align="center"valign="top"style="padding:0;Margin:0"><img title="Youtube"src="https://eitehrg.stripocdn.email/content/assets/img/social-icons/logo-black/youtube-logo-black.png"alt="Yt"width="32"height="32"style="display:block;border:0;outline:0;text-decoration:none;-ms-interpolation-mode:bicubic"></td></tr></table></td></tr><tr><td align="center"style="padding:0;Margin:0;padding-bottom:35px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial,'helvetica neue',helvetica,sans-serif;line-height:18px;color:#333;font-size:12px">UET Booking © 2024&nbsp;&nbsp;All Rights Reserved.</p><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial,'helvetica neue',helvetica,sans-serif;line-height:18px;color:#333;font-size:12px">Cau Giay, Ha Noi, Vietnam</p></td></tr></table></td></tr></table></td></tr></table></td></tr></table></td></tr></table></div></body></html>`;
  }
}
