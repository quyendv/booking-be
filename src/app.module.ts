import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import envConfig, { envValidation } from './configs/env.config';
import { DatabaseModule } from './database/database.module';

const VALID_ENV = ['local', 'development', 'production'];
const environment = process.env.NODE_ENV ?? 'local';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/env/.env.${
        VALID_ENV.includes(environment) ? environment : 'local'
      }`,
      isGlobal: true,
      load: [envConfig],
      validationSchema: envValidation,
    }),
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
