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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("../service/auth.service");
const guard_1 = require("../../common/guard");
const create_user_dto_1 = require("../../user/dto/create-user.dto");
const create_system_administrator_dto_1 = require("../dto/create-system-administrator.dto");
const user_login_dto_1 = require("../dto/user-login.dto");
const user_verification_dto_1 = require("../dto/user-verification.dto");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async createSystemAdministrator(createSystemAdministrator) {
        return await this.authService.createSystemAdministrator(createSystemAdministrator);
    }
    async registration(createUserData) {
        return await this.authService.createUser(createUserData);
    }
    async verifyVerificationCode(verificationData, request) {
        let verificationCode = verificationData.verificationCode;
        let userData = request["user"];
        return await this.authService.verifyRegCode(userData, verificationCode);
    }
    login(userLoginDto) {
        return this.authService.login(userLoginDto);
    }
    resetPassword() {
        return this.authService.resetPassword();
    }
    async verifyToken(token) {
        return this.authService.verifyToken(token);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('/system-administrator'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_system_administrator_dto_1.CreateSystemAdministratorDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "createSystemAdministrator", null);
__decorate([
    (0, common_1.Post)('/registration'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "registration", null);
__decorate([
    (0, common_1.Post)('/registration/verify/verificationcode'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(guard_1.AuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_verification_dto_1.userVerificationDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyVerificationCode", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_login_dto_1.UserLoginDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Post)('mail-verify/:token'),
    __param(0, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyToken", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    (0, swagger_1.ApiTags)('Auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map