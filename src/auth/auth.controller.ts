import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BaseResponse } from '~/base/types/response.type';
import { UserEntity } from '~/users/entities/user.entity';
import { AuthService } from './auth.service';
import { AuthUser } from './decorators/user.decorator';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { AuthGuard } from './guards/auth.guard';
import { UserPayload } from './types/request.type';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  signIn(@AuthUser() user: UserPayload): Promise<UserEntity> {
    return this.authService.signIn(user);
  }

  @Post('sign-up')
  signUp(@AuthUser() user: UserPayload): Promise<BaseResponse> {
    return this.authService.signUp(user);
  }

  @Post('verify-email')
  verifyEmail(@AuthUser() user: UserPayload, @Body() body: VerifyEmailDto): Promise<UserEntity> {
    return this.authService.verifyEmail(user, body.verifyToken);
  }
}
