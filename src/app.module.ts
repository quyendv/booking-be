import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AddressModule } from './address/address.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CustomExceptionFilter } from './base/filters/exception.filter';
import { LoggingInterceptor } from './base/interceptors/logging.interceptor';
import { BookingModule } from './bookings/booking.module';
import envConfig, { envPath, envValidation } from './configs/env.config';
import { CustomerModule } from './customers/customer.module';
import { DatabaseModule } from './database/database.module';
import { HotelModule } from './hotels/hotel.module';
import { MailerModule } from './mailer/mailer.module';
import { StorageModule } from './storage/storage.module';
import { UserModule } from './users/user.module';
import { ReviewModule } from './reviews/review.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: envPath,
      isGlobal: true,
      load: [envConfig],
      validationSchema: envValidation,
    }),
    DatabaseModule,
    AuthModule,
    StorageModule,
    MailerModule,
    UserModule,
    CustomerModule,
    AddressModule,
    HotelModule,
    BookingModule,
    ReviewModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: CustomExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
  ],
})
export class AppModule {}
