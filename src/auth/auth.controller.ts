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
import { Public } from './decorators/public.decorator';
import { AuthUser } from './decorators/user.decorator';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { AuthGuard } from './guards/auth.guard';
import { UserPayload } from './types/request.type';
import { RolesGuard } from './guards/role.guard';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from './decorators/role.decorator';
import { PermissionActions } from './types/role.type';
import { UserService } from '~/users/user.service';

@ApiTags('Auth')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard, RolesGuard)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('sign-in')
  signIn(@AuthUser() user: UserPayload): Promise<UserEntity> {
    return this.authService.signIn(user);
  }

  @Post('sign-up')
  signUp(@AuthUser() user: UserPayload): Promise<BaseResponse> {
    return this.authService.signUp(user);
  }

  @Post('verify-email')
  @Public()
  verifyEmail(@Body() body: VerifyEmailDto): Promise<UserEntity> {
    return this.authService.verifyEmail(body.verifyToken);
  }

  @Post('firebase')
  @Roles([PermissionActions.CREATE, 'firebase-account'])
  createFirebaseAccount(@Body() body: { email: string }): Promise<void> {
    return this.userService.createFirebaseUser(body.email);
  }
}
