import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { setupSwagger } from '~/configs/swagger.config';
import { AppModule } from './app.module';
import { IEnvironmentConfig } from './configs/env.config';
import { initFirebaseAdmin } from './configs/firebase.config';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  setupSwagger(app);

  // setup validator
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // enable cors
  app.enableCors();

  // setup firebase
  initFirebaseAdmin();

  const PORT = <number>configService.get<IEnvironmentConfig>('environment')?.port;
  await app.listen(PORT, () => Logger.debug(`Server is running on port ${PORT}`, 'main.ts'));
}
bootstrap();
