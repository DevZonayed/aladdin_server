export interface EnvConfig {
    [prop: string]: string;
}
export declare const NODE_ENV = "NODE_ENV";
export declare const MONGO_URI_PREFIX = "MONGO_URI_PREFIX";
export declare const DB_PORT = "DB_PORT";
export declare const DB_NAME = "DB_NAME";
export declare const DB_HOST = "DB_HOST";
export declare const DB_USER = "DB_USER";
export declare const DB_PASSWORD = "DB_PASSWORD";
export declare const THROTTLER_SHORT_NAME = "THROTTLER_SHORT_NAME";
export declare const THROTTLER_MEDIUM_NAME = "THROTTLER_MEDIUM_NAME";
export declare const THROTTLER_LONG_NAME = "THROTTLER_LONG_NAME";
export declare const THROTTLER_SHORT_TTL = "THROTTLER_SHORT_TTL";
export declare const THROTTLER_MEDIUM_TTL = "THROTTLER_MEDIUM_TTL";
export declare const THROTTLER_LONG_TTL = "THROTTLER_LONG_TTL";
export declare const THROTTLER_SHORT_LIMIT = "THROTTLER_SHORT_LIMIT";
export declare const THROTTLER_MEDIUM_LIMIT = "THROTTLER_MEDIUM_LIMIT";
export declare const THROTTLER_LONG_LIMIT = "THROTTLER_LONG_LIMIT";
export declare const MAIL_HOST = "MAIL_HOST";
export declare const MAIL_PORT = "MAIL_PORT";
export declare const MAIL_SECURE = "MAIL_SECURE";
export declare const MAIL_IGNORE_TLS = "MAIL_IGNORE_TLS";
export declare const MAIL_USER = "MAIL_USER";
export declare const MAIL_PASSWORD = "MAIL_PASSWORD";
export declare const MAIL_VERIFICATION_HOST = "MAIL_VERIFICATION_HOST";
export declare const JWT_SECRECT_KEY = "JWT_SECRECT_KEY";
export declare const JWT_EXPIRES_IN = "JWT_EXPIRES_IN";
export declare const MAIL_SENDER_NAME = "MAIL_SENDER_NAME";
export declare const GOOGLE_CLIENT_ID = "GOOGLE_CLIENT_ID";
export declare const GOOGLE_CLIENT_SECRET = "GOOGLE_CLIENT_SECRET";
export declare const GOOGLE_AUTH_REDIRECT = "GOOGLE_AUTH_REDIRECT";
export declare const FACEBOOK_APP_ID = "FACEBOOK_APP_ID";
export declare const FACEBOOK_APP_SECRET = "FACEBOOK_APP_SECRET";
export declare const FACEBOOK_AUTH_REDIRECT = "FACEBOOK_AUTH_REDIRECT";
export declare const APPLE_CLIENT_ID = "APPLE_CLIENT_ID";
export declare const APPLE_TEAM_ID = "APPLE_TEAM_ID";
export declare const APPLE_KEY_ID = "APPLE_KEY_ID";
export declare const APPLE_PRIVATE_KEY = "APPLE_PRIVATE_KEY";
export declare const APPLE_AUTH_REDIRECT = "APPLE_AUTH_REDIRECT";
export declare class CoreConfigService {
    private readonly envConfig;
    constructor();
    private validateInput;
    get(key: string): string;
}
