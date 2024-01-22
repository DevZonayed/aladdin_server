import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { CoreConfigService } from '../../common/config/core/core.service';
import { AuthService } from '../service/auth.service';
declare const GoogleAuthService_base: new (...args: any[]) => Strategy;
export declare class GoogleAuthService extends GoogleAuthService_base {
    private readonly config;
    private readonly authService;
    constructor(config: CoreConfigService, authService: AuthService);
    validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback): Promise<void>;
}
export {};
