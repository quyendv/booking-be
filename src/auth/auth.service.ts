import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import * as admin from 'firebase-admin';
import { BaseResponse } from '~/base/types/response.type';
import { IEnvironmentConfig } from '~/configs/env.config';
import { UserEntity } from '~/users/entities/user.entity';
import { UserService } from '~/users/user.service';
import { UserPayload } from './types/request.type';
import { DEFAULT_LOCALE } from '~/base/constants/locale.constant';
import { MailerService } from '~/mailers/mailer.service';

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
    await this.userService.createUnverifiedCustomer(payload);
    await this.sendVerificationEmail(payload.email, await this.generateVerifiedLink(payload));
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

  private async generateVerifiedLink(payload: UserPayload): Promise<string> {
    const { clientURL, jwtSecret } = <IEnvironmentConfig>this.configService.get('environment');
    const token = await this.jwtService.signAsync(payload, { secret: jwtSecret, expiresIn: '2d' });
    return `${clientURL}/${DEFAULT_LOCALE}/verify-email?token=${token}`; // TODO: should be dynamic
  }

  private async sendVerificationEmail(email: string, verifyLink: string): Promise<void> {
    Logger.log(`Sending verification email to "${email}"`, 'Start');
    await this.mailerService.sendEmail({
      content: `<div>Please verify your email address by clicking on the <a href='${verifyLink}'>link</a>.</div>`,
      to: email,
      subject: '[Booking App] Verify Your Email Address',
    });
    Logger.log(`Verification email sent to "${email}"`, 'Done');
  }
}
