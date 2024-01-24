/// <reference types="passport-apple" />
import { CoreConfigService } from '../../common/config/core/core.service';
import { AuthService } from '../service/auth.service';
declare const AppleAuthService_base: new (...args: any[]) => import("passport-apple");
export declare class AppleAuthService extends AppleAuthService_base {
    private readonly config;
    private readonly authService;
    constructor(config: CoreConfigService, authService: AuthService);
    validate(accessToken: string, refreshToken: string, idToken: string, profile: any): Promise<{
        id: any;
        email: any;
        firstName: any;
        lastName: any;
    }>;
}
export {};
