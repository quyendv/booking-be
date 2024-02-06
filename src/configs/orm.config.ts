import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { envPath } from './env.config';

config({ path: envPath });
const configService = new ConfigService();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_NAME'),
  entities: ['dist/**/entities/*.entity.js'],
  migrations: ['dist/src/database/migrations/*.js', 'dist/src/database/seeds/*.js'],
};

export default new DataSource(dataSourceOptions);
