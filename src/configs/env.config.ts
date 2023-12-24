import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export interface IEnvironmentConfig {
  port: number;
  nodeEnv: 'local' | 'development' | 'production';
  // logger: 'enabled' | 'disabled';
}

export const envValidation = Joi.object({
  // NODE_ENV: Joi.string().valid('development', 'production'),
  PORT: Joi.number().default(8080),
});

export default registerAs<IEnvironmentConfig>('environment', () => ({
  port: Number(process.env.PORT),
  nodeEnv: process.env.NODE_ENV as any,
  // logger: process.env.LOGGER,
}));
