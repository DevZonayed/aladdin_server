import { Profile, Strategy } from 'passport-facebook';
import { CoreConfigService } from '../../common/config/core/core.service';
import { AuthService } from '../service/auth.service';
declare const FacebookAuthService_base: new (...args: any[]) => Strategy;
export declare class FacebookAuthService extends FacebookAuthService_base {
    private readonly config;
    private readonly authService;
    constructor(config: CoreConfigService, authService: AuthService);
    validate(accessToken: string, refreshToken: string, profile: Profile): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
    }>;
}
export {};
