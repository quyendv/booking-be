import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CustomerModule } from '~/customers/customer.module';
import { HotelModule } from '~/hotels/hotel.module';
import { MailerModule } from '~/mailers/mailer.module';
import { ReceptionistModule } from '~/receptionists/receptionist.module';
import { AbilityFactory } from './abilities/ability.factory';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Global()
@Module({
  imports: [
    JwtModule.register({ global: true, secret: process.env.JWT_SECRET }),
    CustomerModule,
    HotelModule,
    ReceptionistModule,
    MailerModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AbilityFactory],
  exports: [AuthService, AbilityFactory],
})
export class AuthModule {}
