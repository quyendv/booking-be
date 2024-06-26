import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as Joi from 'joi';

export enum VALID_ENV {
  LOCAL = 'local',
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
}

const environment = (process.env.NODE_ENV as any) ?? VALID_ENV.LOCAL;

export const envPath = `${process.cwd()}/env/.env.${
  Object.values(VALID_ENV).includes(environment) ? environment : VALID_ENV.LOCAL
}`;

export interface IEnvironmentConfig {
  port: number;
  nodeEnv: VALID_ENV;
  clientURL: string;
  jwtSecret: string;
  firebase: { defaultAccountPassword: string };
  database: TypeOrmModuleOptions;
  mailer: {
    resendAPIKey: string;
    googleOauthClientID: string;
    googleOauthClientSecret: string;
    googleMailerRefreshToken: string;
  };
  payment: {
    vnp_TmnCode: string;
    vnp_HashSecret: string;
    // stripe, momo, zalo, ...
  };
}

export const envValidation = Joi.object({
  // NODE_ENV: Joi.string().valid('development', 'production'),
  PORT: Joi.number().default(8080),
  CLIENT_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  FIREBASE_DEFAULT_ACCOUNT_PASSWORD: Joi.string().required(),
  DB_HOST: Joi.required(),
  DB_PORT: Joi.required(),
  DB_USERNAME: Joi.required(),
  DB_PASSWORD: Joi.required(),
  DB_NAME: Joi.required(),
  RESEND_API_KEY: Joi.required(),
  GOOGLE_OAUTH_CLIENT_ID: Joi.required(),
  GOOGLE_OAUTH_CLIENT_SECRET: Joi.required(),
  GOOGLE_MAILER_REFRESH_TOKEN: Joi.required(),
  VNP_TMN_CODE: Joi.required(),
  VNP_HASH_SECRET: Joi.required(),
});

export default registerAs<IEnvironmentConfig>('environment', () => ({
  port: Number(process.env.PORT),
  nodeEnv: environment,
  clientURL: <string>process.env.CLIENT_URL,
  jwtSecret: <string>process.env.JWT_SECRET,
  firebase: {
    defaultAccountPassword: <string>process.env.FIREBASE_DEFAULT_ACCOUNT_PASSWORD,
  },
  database: {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: ['dist/**/entities/*.entity.js'],
    // entities: ['src/**/entities/*.entity.ts'],
    // autoLoadEntities: true,
    synchronize: false,
    logging: false,
    migrations: ['dist/src/database/migrations/*.js', 'dist/src/database/seeds/*.js'],
    // migrations: ['src/database/migrations/*.ts', 'src/database/seeds/*.ts'],
    migrationsTableName: 'migrations',
  },
  mailer: {
    resendAPIKey: <string>process.env.RESEND_API_KEY,
    googleOauthClientID: <string>process.env.GOOGLE_OAUTH_CLIENT_ID,
    googleOauthClientSecret: <string>process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    googleMailerRefreshToken: <string>process.env.GOOGLE_MAILER_REFRESH_TOKEN,
  },
  payment: {
    vnp_TmnCode: <string>process.env.VNP_TMN_CODE,
    vnp_HashSecret: <string>process.env.VNP_HASH_SECRET,
  },
}));
