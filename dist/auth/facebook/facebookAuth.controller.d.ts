export declare class FacebookAuthController {
    facebookLogin(): Promise<void>;
    facebookLoginRedirect(req: any): {
        msg: string;
        userInfo: any;
    };
}
