import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseResponse } from '~/base/types/response.type';
import { UserEntity } from '~/users/entities/user.entity';
import { AccountInfo } from '~/users/types/user.type';
import { UserService } from '~/users/user.service';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { Roles } from './decorators/role.decorator';
import { AuthUser } from './decorators/user.decorator';
import { VerifyEmailDto } from './dtos/verify-email.dto';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/role.guard';
import { UserPayload } from './types/request.type';
import { PermissionActions } from './types/role.type';

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
  signIn(@AuthUser() user: UserPayload): Promise<AccountInfo> {
    // return this.authService.signIn(user);
    return this.userService.getCurrentInfo(user);
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

  @Post('resend-verify-email')
  async resendVerifyEmail(@AuthUser() user: UserPayload): Promise<void> {
    // TODO: check if user is already verified
    const emailContent = (await this.authService.generateVerificationContent(user)).content;
    await this.authService.sendVerificationEmail(user.email, emailContent);
  }

  @Post('firebase')
  @Roles([PermissionActions.CREATE, 'firebase-account'])
  createFirebaseAccount(@Body() body: { email: string }): Promise<void> {
    return this.userService.createFirebaseUser(body.email);
  }

  @Get('users')
  @Roles([PermissionActions.LIST, UserEntity])
  listUsers(): Promise<AccountInfo[]> {
    return this.userService.listAccountInfo();
  }
}
