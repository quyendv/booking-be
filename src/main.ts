import { NestFactory } from '@nestjs/core';
import { setupSwagger } from '~/configs/swagger.config';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  setupSwagger(app);

  await app.listen(5000);
}
bootstrap();
