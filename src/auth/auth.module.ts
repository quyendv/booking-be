import { Global, Module } from '@nestjs/common';
import { AbilityFactory } from './abilities/ability.factory';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Global()
@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthService, AbilityFactory],
  exports: [AuthService, AbilityFactory],
})
export class AuthModule {}
