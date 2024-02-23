import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { HotelModule } from '~/hotels/hotel.module';
import { AbilityFactory } from './abilities/ability.factory';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CustomerModule } from '~/customers/customer.module';

@Global()
@Module({
  imports: [
    JwtModule.register({ global: true, secret: process.env.JWT_SECRET }),
    CustomerModule,
    HotelModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AbilityFactory],
  exports: [AuthService, AbilityFactory],
})
export class AuthModule {}
