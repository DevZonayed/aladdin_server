"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreConfigService = exports.APPLE_AUTH_REDIRECT = exports.APPLE_PRIVATE_KEY = exports.APPLE_KEY_ID = exports.APPLE_TEAM_ID = exports.APPLE_CLIENT_ID = exports.FACEBOOK_AUTH_REDIRECT = exports.FACEBOOK_APP_SECRET = exports.FACEBOOK_APP_ID = exports.GOOGLE_AUTH_REDIRECT = exports.GOOGLE_CLIENT_SECRET = exports.GOOGLE_CLIENT_ID = exports.MAIL_SENDER_NAME = exports.JWT_EXPIRES_IN = exports.JWT_SECRECT_KEY = exports.MAIL_VERIFICATION_HOST = exports.MAIL_PASSWORD = exports.MAIL_USER = exports.MAIL_IGNORE_TLS = exports.MAIL_SECURE = exports.MAIL_PORT = exports.MAIL_HOST = exports.THROTTLER_LONG_LIMIT = exports.THROTTLER_MEDIUM_LIMIT = exports.THROTTLER_SHORT_LIMIT = exports.THROTTLER_LONG_TTL = exports.THROTTLER_MEDIUM_TTL = exports.THROTTLER_SHORT_TTL = exports.THROTTLER_LONG_NAME = exports.THROTTLER_MEDIUM_NAME = exports.THROTTLER_SHORT_NAME = exports.DB_PASSWORD = exports.DB_USER = exports.DB_HOST = exports.DB_NAME = exports.DB_PORT = exports.MONGO_URI_PREFIX = exports.NODE_ENV = void 0;
const common_1 = require("@nestjs/common");
const dotenv = require("dotenv");
const Joi = require("joi");
exports.NODE_ENV = 'NODE_ENV';
exports.MONGO_URI_PREFIX = 'MONGO_URI_PREFIX';
exports.DB_PORT = 'DB_PORT';
exports.DB_NAME = 'DB_NAME';
exports.DB_HOST = 'DB_HOST';
exports.DB_USER = 'DB_USER';
exports.DB_PASSWORD = 'DB_PASSWORD';
exports.THROTTLER_SHORT_NAME = 'THROTTLER_SHORT_NAME';
exports.THROTTLER_MEDIUM_NAME = 'THROTTLER_MEDIUM_NAME';
exports.THROTTLER_LONG_NAME = 'THROTTLER_LONG_NAME';
exports.THROTTLER_SHORT_TTL = 'THROTTLER_SHORT_TTL';
exports.THROTTLER_MEDIUM_TTL = 'THROTTLER_MEDIUM_TTL';
exports.THROTTLER_LONG_TTL = 'THROTTLER_LONG_TTL';
exports.THROTTLER_SHORT_LIMIT = 'THROTTLER_SHORT_LIMIT';
exports.THROTTLER_MEDIUM_LIMIT = 'THROTTLER_MEDIUM_LIMIT';
exports.THROTTLER_LONG_LIMIT = 'THROTTLER_LONG_LIMIT';
exports.MAIL_HOST = 'MAIL_HOST';
exports.MAIL_PORT = 'MAIL_PORT';
exports.MAIL_SECURE = 'MAIL_SECURE';
exports.MAIL_IGNORE_TLS = 'MAIL_IGNORE_TLS';
exports.MAIL_USER = 'MAIL_USER';
exports.MAIL_PASSWORD = 'MAIL_PASSWORD';
exports.MAIL_VERIFICATION_HOST = 'MAIL_VERIFICATION_HOST';
exports.JWT_SECRECT_KEY = 'JWT_SECRECT_KEY';
exports.JWT_EXPIRES_IN = 'JWT_EXPIRES_IN';
exports.MAIL_SENDER_NAME = 'MAIL_SENDER_NAME';
exports.GOOGLE_CLIENT_ID = 'GOOGLE_CLIENT_ID';
exports.GOOGLE_CLIENT_SECRET = 'GOOGLE_CLIENT_SECRET';
exports.GOOGLE_AUTH_REDIRECT = 'GOOGLE_AUTH_REDIRECT';
exports.FACEBOOK_APP_ID = 'FACEBOOK_APP_ID';
exports.FACEBOOK_APP_SECRET = 'FACEBOOK_APP_SECRET';
exports.FACEBOOK_AUTH_REDIRECT = 'FACEBOOK_AUTH_REDIRECT';
exports.APPLE_CLIENT_ID = 'APPLE_CLIENT_ID';
exports.APPLE_TEAM_ID = 'APPLE_TEAM_ID';
exports.APPLE_KEY_ID = 'APPLE_KEY_ID';
exports.APPLE_PRIVATE_KEY = 'APPLE_PRIVATE_KEY';
exports.APPLE_AUTH_REDIRECT = 'APPLE_AUTH_REDIRECT';
let CoreConfigService = class CoreConfigService {
    constructor() {
        const config = dotenv.config().parsed;
        this.envConfig = this.validateInput(config);
    }
    validateInput(envConfig) {
        const envVarsSchema = Joi.object({
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
        const { error, value: validatedEnvConfig } = envVarsSchema.validate(envConfig);
        if (error) {
            common_1.Logger.error(error, error.stack, this.constructor.name);
            process.exit(1);
        }
        return validatedEnvConfig;
    }
    get(key) {
        switch (key) {
            case exports.DB_NAME:
                return process.env.NODE_ENV === 'test'
                    ? `test_${this.envConfig[key]}`
                    : this.envConfig[key];
            default:
                return this.envConfig[key];
        }
    }
};
exports.CoreConfigService = CoreConfigService;
exports.CoreConfigService = CoreConfigService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], CoreConfigService);
//# sourceMappingURL=core.service.js.map