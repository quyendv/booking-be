import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { setupSwagger } from '~/configs/swagger.config';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  setupSwagger(app);

  // setup validator
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // enable cors
  app.enableCors();

  // setup firebase

  const PORT = process.env.PORT || 8080;
  await app.listen(PORT, () => Logger.debug(`Server is running on port ${PORT}`, 'main.ts'));
}
bootstrap();
