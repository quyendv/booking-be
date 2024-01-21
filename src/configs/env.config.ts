import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as Joi from 'joi';

const VALID_ENV = ['local', 'development', 'production'];
const environment = process.env.NODE_ENV ?? VALID_ENV[0];

export const envPath = `${process.cwd()}/env/.env.${
  VALID_ENV.includes(environment) ? environment : VALID_ENV[0]
}`;

export interface IEnvironmentConfig {
  port: number;
  nodeEnv: 'local' | 'development' | 'production';
  database: TypeOrmModuleOptions;
  mailer: { resendAPIKey: string };
}

export const envValidation = Joi.object({
  // NODE_ENV: Joi.string().valid('development', 'production'),
  PORT: Joi.number().default(8080),
  DB_HOST: Joi.required(),
  DB_PORT: Joi.required(),
  DB_USERNAME: Joi.required(),
  DB_PASSWORD: Joi.required(),
  DB_NAME: Joi.required(),
  RESEND_API_KEY: Joi.required(),
});

export default registerAs<IEnvironmentConfig>('environment', () => ({
  port: Number(process.env.PORT),
  nodeEnv: process.env.NODE_ENV as any,
  // logger: process.env.LOGGER,
  database: {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: ['dist/**/entities/*.entity.js'],
    // autoLoadEntities: true,
    synchronize: false,
    logging: false,
    migrations: ['dist/src/database/migrations/*.js', 'dist/src/database/seeds/*.js'],
    migrationsTableName: 'migrations',
  },
  mailer: { resendAPIKey: process.env.RESEND_API_KEY as string },
}));
