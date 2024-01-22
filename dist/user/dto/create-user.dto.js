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
exports.CreateUserDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const enum_signin_by_social_id_1 = require("../../common/enum/enum-signin-by-social-id");
const enum_user_role_1 = require("../../common/enum/enum-user-role");
class CreateUserDto {
}
exports.CreateUserDto = CreateUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'John Doe', description: 'Full name of the user' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'john.doe@example.com',
        description: 'Email address of the user',
    }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'password123', description: 'Password for the user' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '1234567890',
        description: 'Mobile number of the user',
    }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "mobileNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '123 Main St, City',
        description: 'Address of the user',
    }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, description: 'Status of the user' }),
    __metadata("design:type", Boolean)
], CreateUserDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: true,
        description: 'Acceptance of terms and conditions',
    }),
    __metadata("design:type", Boolean)
], CreateUserDto.prototype, "termsAndCondition", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: 'array',
        items: {
            type: 'string',
            enum: Object.values(enum_user_role_1.UserRole),
            example: enum_user_role_1.UserRole.USER,
        },
        description: 'Roles assigned to the user',
    }),
    __metadata("design:type", Array)
], CreateUserDto.prototype, "roles", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: enum_signin_by_social_id_1.UserSigninBy.DEFAULT_CONNECTION,
        description: 'Methods used for user sign-in',
        enum: enum_signin_by_social_id_1.UserSigninBy,
        isArray: true,
    }),
    __metadata("design:type", Array)
], CreateUserDto.prototype, "signinBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'US', description: 'Country of the user' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'https://example.com/avatar.jpg',
        description: "URL of the user's profile image",
    }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "profileImage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: { verificationCode: 8794, expiryTime: 360 },
        description: 'Object containing verification code and expiry time',
        type: Object,
    }),
    __metadata("design:type", Boolean)
], CreateUserDto.prototype, "sentMail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
        description: 'JWT token for authentication',
    }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "token", void 0);
//# sourceMappingURL=create-user.dto.js.map