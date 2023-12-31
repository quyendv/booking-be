import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { UserPayload } from './types/request.type';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Test
  @Get('authenticate')
  // @UseGuards(AuthGuard)
  authenticate(@Req() req: Request): Promise<UserPayload> {
    const authToken = req.headers.authorization;
    return this.authService.authenticate(authToken);
  }

  // @Post('sign-in')
  // @UseGuards(AuthGuard)
  // signIn(@Req() req: RequestWithUser): Promise<UserEntity> {
  //   return this.authService.signIn(req.user);
  // }
}
