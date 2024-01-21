import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CustomExceptionFilter } from './base/filters/exception.filter';
import { LoggingInterceptor } from './base/interceptors/logging.interceptor';
import envConfig, { envValidation } from './configs/env.config';
import { DatabaseModule } from './database/database.module';
import { MailerModule } from './mailer/mailer.module';

const VALID_ENV = ['local', 'development', 'production'];
const environment = process.env.NODE_ENV ?? VALID_ENV[0];

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/env/.env.${
        VALID_ENV.includes(environment) ? environment : VALID_ENV[0]
      }`,
      isGlobal: true,
      load: [envConfig],
      validationSchema: envValidation,
    }),
    DatabaseModule,
    AuthModule,
    MailerModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: CustomExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
  ],
})
export class AppModule {}
