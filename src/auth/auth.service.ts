import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { UserPayload } from './types/request.type';

@Injectable()
export class AuthService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(/* private readonly userService: UserService */) {}

  async authenticate(authToken: string | undefined): Promise<UserPayload> {
    if (!authToken) throw new BadRequestException('Missing Auth Token');

    const match = authToken.match(/^Bearer (.*)$/);
    if (!match || match.length < 2) {
      throw new UnauthorizedException('Invalid Bearer Token');
    }

    try {
      const tokenString = match[1];
      const decodedToken: admin.auth.DecodedIdToken = await admin.auth().verifyIdToken(tokenString);

      const { email, uid, picture, name }: UserPayload = decodedToken;
      return { email, uid, picture, name };
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  // async signIn(payload: Payload): Promise<UserEntity> {
  //   const user = await this.userService.getUserByEmail(payload.email as string, {
  //     roles: true,
  //   });
  //   if (!user) {
  //     throw new UnauthorizedException(
  //       `User ${payload.email} not found or INACTIVE in the system. Require admin active this email`,
  //     );
  //   }
  //   return user;
  // }
}
