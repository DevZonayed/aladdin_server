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
exports.RolesGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const jwt = require("jsonwebtoken");
const core_service_1 = require("../config/core/core.service");
let RolesGuard = class RolesGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        try {
            const roles = this.reflector.get('roles', context.getHandler());
            if (!roles) {
                return true;
            }
            const req = context.switchToHttp().getRequest();
            const token = this.extractToken(req.headers.authorization);
            if (!token) {
                return false;
            }
            const user = this.verifyToken(token);
            if (!user || !user.roles) {
                return false;
            }
            const hasPermission = () => {
                const userHasRoles = user.roles.some((role) => roles.includes(role));
                if (!userHasRoles) {
                    return false;
                }
                return true;
            };
            return hasPermission();
        }
        catch (error) {
            return false;
        }
    }
    extractToken(authorizationHeader) {
        if (!authorizationHeader) {
            return null;
        }
        const tokenParts = authorizationHeader.split(' ');
        if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
            return null;
        }
        return tokenParts[1];
    }
    verifyToken(token) {
        try {
            const config = new core_service_1.CoreConfigService();
            const decoded = jwt.verify(token, config.get(core_service_1.JWT_SECRECT_KEY));
            return decoded;
        }
        catch (error) {
            return null;
        }
    }
};
exports.RolesGuard = RolesGuard;
exports.RolesGuard = RolesGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], RolesGuard);
//# sourceMappingURL=roles.guard.js.map