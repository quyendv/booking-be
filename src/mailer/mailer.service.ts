import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as SMTPTransport from 'nodemailer/lib/smtp-transport';
import { IEnvironmentConfig } from '~/configs/env.config';
import { SendEmailType } from './types/mailer.type';

@Injectable()
export class MailerService {
  constructor(private readonly configService: ConfigService) {}

  private getResendTransport(): nodemailer.Transporter<SMTPTransport.SentMessageInfo> {
    return nodemailer.createTransport({
      host: 'smtp.resend.com',
      secure: true,
      port: 465,
      auth: {
        user: 'resend',
        pass: this.configService.getOrThrow<string>('environment.mailer.resendAPIKey'),
      },
    });
  }

  private getGmailTransport(): nodemailer.Transporter<SMTPTransport.SentMessageInfo> {
    const mailerConfig =
      this.configService.getOrThrow<IEnvironmentConfig['mailer']>('environment.mailer');

    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'oauth2',
        user: 'contact.uet.booking@gmail.com',
        clientId: mailerConfig.googleOauthClientID,
        clientSecret: mailerConfig.googleOauthClientSecret,
        refreshToken: mailerConfig.googleMailerRefreshToken,
      },
    });
  }

  private async sendResendEmail(data: SendEmailType): Promise<string> {
    const transporter = this.getResendTransport();
    const info = await transporter.sendMail({
      from: 'onboarding@resend.dev', // replace with custom domain
      to: data.to,
      subject: data.subject,
      html: data.content,
    });
    return info.messageId;
  }

  async sendEmail(data: SendEmailType): Promise<string> {
    const transporter = this.getGmailTransport();
    const info = await transporter.sendMail({
      from: 'contact.uet.booking@gmail.com',
      to: data.to,
      subject: data.subject,
      html: data.content,
    });
    return info.messageId;
  }
}
