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
exports.FacebookAuthService = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_facebook_1 = require("passport-facebook");
const core_service_1 = require("../../common/config/core/core.service");
const auth_service_1 = require("../service/auth.service");
let FacebookAuthService = class FacebookAuthService extends (0, passport_1.PassportStrategy)(passport_facebook_1.Strategy, 'facebook') {
    constructor(config, authService) {
        super({
            clientID: config.get(core_service_1.FACEBOOK_APP_ID),
            clientSecret: config.get(core_service_1.FACEBOOK_APP_SECRET),
            callbackURL: config.get(core_service_1.FACEBOOK_AUTH_REDIRECT),
            scope: 'email',
            profileFields: ['name', 'email'],
        });
        this.config = config;
        this.authService = authService;
    }
    async validate(accessToken, refreshToken, profile) {
        return {
            id: profile.id,
            email: profile.emails[0].value,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
        };
    }
};
exports.FacebookAuthService = FacebookAuthService;
exports.FacebookAuthService = FacebookAuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_service_1.CoreConfigService,
        auth_service_1.AuthService])
], FacebookAuthService);
//# sourceMappingURL=facebookAuth.service.js.map