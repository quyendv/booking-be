import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { SendEmailType } from './types/mailer.type';

@Injectable()
export class MailerService {
  private transporter: Transporter<SMTPTransport.SentMessageInfo>;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.resend.com',
      secure: true,
      port: 465,
      auth: { user: 'resend', pass: process.env.RESEND_API_KEY },
    });
  }

  async sendEmail(data: SendEmailType): Promise<string> {
    const info = await this.transporter.sendMail({
      from: 'onboarding@resend.dev', // replace with custom domain
      to: data.to,
      subject: data.subject,
      html: data.content,
    });
    return info.messageId;
  }
}
