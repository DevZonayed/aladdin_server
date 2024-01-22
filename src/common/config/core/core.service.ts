import { Injectable, Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as Joi from 'joi';

export interface EnvConfig {
  [prop: string]: string;
}

export const NODE_ENV = 'NODE_ENV';
export const MONGO_URI_PREFIX = 'MONGO_URI_PREFIX';
export const DB_PORT = 'DB_PORT';
export const DB_NAME = 'DB_NAME';
export const DB_HOST = 'DB_HOST';
export const DB_USER = 'DB_USER';
export const DB_PASSWORD = 'DB_PASSWORD';
export const THROTTLER_SHORT_NAME = 'THROTTLER_SHORT_NAME';
export const THROTTLER_MEDIUM_NAME = 'THROTTLER_MEDIUM_NAME';
export const THROTTLER_LONG_NAME = 'THROTTLER_LONG_NAME';
export const THROTTLER_SHORT_TTL = 'THROTTLER_SHORT_TTL';
export const THROTTLER_MEDIUM_TTL = 'THROTTLER_MEDIUM_TTL';
export const THROTTLER_LONG_TTL = 'THROTTLER_LONG_TTL';
export const THROTTLER_SHORT_LIMIT = 'THROTTLER_SHORT_LIMIT';
export const THROTTLER_MEDIUM_LIMIT = 'THROTTLER_MEDIUM_LIMIT';
export const THROTTLER_LONG_LIMIT = 'THROTTLER_LONG_LIMIT';
export const MAIL_HOST = 'MAIL_HOST';
export const MAIL_PORT = 'MAIL_PORT';
export const MAIL_SECURE = 'MAIL_SECURE';
export const MAIL_IGNORE_TLS = 'MAIL_IGNORE_TLS';
export const MAIL_USER = 'MAIL_USER';
export const MAIL_PASSWORD = 'MAIL_PASSWORD';
export const MAIL_VERIFICATION_HOST = 'MAIL_VERIFICATION_HOST';
export const JWT_SECRECT_KEY = 'JWT_SECRECT_KEY';
export const JWT_EXPIRES_IN = 'JWT_EXPIRES_IN';
export const MAIL_SENDER_NAME = 'MAIL_SENDER_NAME';

export const GOOGLE_CLIENT_ID = 'GOOGLE_CLIENT_ID';
export const GOOGLE_CLIENT_SECRET = 'GOOGLE_CLIENT_SECRET';
export const GOOGLE_AUTH_REDIRECT = 'GOOGLE_AUTH_REDIRECT';

export const FACEBOOK_APP_ID = 'FACEBOOK_APP_ID';
export const FACEBOOK_APP_SECRET = 'FACEBOOK_APP_SECRET';
export const FACEBOOK_AUTH_REDIRECT = 'FACEBOOK_AUTH_REDIRECT';

export const APPLE_CLIENT_ID = 'APPLE_CLIENT_ID';
export const APPLE_TEAM_ID = 'APPLE_TEAM_ID';
export const APPLE_KEY_ID = 'APPLE_KEY_ID';
export const APPLE_PRIVATE_KEY = 'APPLE_PRIVATE_KEY';
export const APPLE_AUTH_REDIRECT = 'APPLE_AUTH_REDIRECT';

@Injectable()
export class CoreConfigService {
  private readonly envConfig: EnvConfig;

  constructor() {
    const config = dotenv.config().parsed;
    this.envConfig = this.validateInput(config);
  }

  private validateInput(envConfig: EnvConfig): EnvConfig {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      NODE_ENV: Joi.string()
        .valid('development', 'production', 'test', 'staging')
        .default('development'),
      DB_PORT: Joi.string().optional(),
      DB_NAME: Joi.string().optional(),
      DB_HOST: Joi.string().optional(),
      DB_USER: Joi.string().optional(),
      DB_PASSWORD: Joi.string().optional(),
      MONGO_URI_PREFIX: Joi.string().optional(),
      THROTTLER_SHORT_NAME: Joi.string().required(),
      THROTTLER_MEDIUM_NAME: Joi.string().required(),
      THROTTLER_LONG_NAME: Joi.string().required(),
      THROTTLER_SHORT_TTL: Joi.number().required(),
      THROTTLER_MEDIUM_TTL: Joi.number().required(),
      THROTTLER_LONG_TTL: Joi.number().required(),
      THROTTLER_SHORT_LIMIT: Joi.number().required(),
      THROTTLER_MEDIUM_LIMIT: Joi.number().required(),
      THROTTLER_LONG_LIMIT: Joi.number().required(),
      MAIL_SENDER_NAME: Joi.string().required(),
      MAIL_HOST: Joi.string().required(),
      MAIL_PORT: Joi.number().required(),
      MAIL_SECURE: Joi.boolean().required(),
      MAIL_IGNORE_TLS: Joi.boolean().required(),
      MAIL_USER: Joi.string().required(),
      MAIL_PASSWORD: Joi.string().required(),
      MAIL_VERIFICATION_HOST: Joi.string().required(),
      JWT_SECRECT_KEY: Joi.string().required(),
      JWT_EXPIRES_IN: Joi.string().required(),

      GOOGLE_CLIENT_ID: Joi.string().required(),
      GOOGLE_CLIENT_SECRET: Joi.string().required(),
      GOOGLE_AUTH_REDIRECT: Joi.string().required(),

      FACEBOOK_APP_ID: Joi.string().required(),
      FACEBOOK_APP_SECRET: Joi.string().required(),
      FACEBOOK_AUTH_REDIRECT: Joi.string().required(),

      APPLE_CLIENT_ID: Joi.string().required(),
      APPLE_TEAM_ID: Joi.string().required(),
      APPLE_KEY_ID: Joi.string().required(),
      APPLE_PRIVATE_KEY: Joi.string().required(),
      APPLE_AUTH_REDIRECT: Joi.string().required(),
    });

    const { error, value: validatedEnvConfig } =
      envVarsSchema.validate(envConfig);
    if (error) {
      Logger.error(error, error.stack, this.constructor.name);
      process.exit(1);
    }
    return validatedEnvConfig;
  }

  get(key: string): string {
    switch (key) {
      case DB_NAME:
        return process.env.NODE_ENV === 'test'
          ? `test_${this.envConfig[key]}`
          : this.envConfig[key];
      default:
        return this.envConfig[key];
    }
  }
}
