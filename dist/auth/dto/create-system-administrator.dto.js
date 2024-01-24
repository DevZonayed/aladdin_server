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
exports.CreateSystemAdministratorDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const enum_user_role_1 = require("../../common/enum/enum-user-role");
class CreateSystemAdministratorDto {
}
exports.CreateSystemAdministratorDto = CreateSystemAdministratorDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'John Doe' }),
    __metadata("design:type", String)
], CreateSystemAdministratorDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'devjonayed320@gmail.com' }),
    __metadata("design:type", String)
], CreateSystemAdministratorDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'password123' }),
    __metadata("design:type", String)
], CreateSystemAdministratorDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1234567890' }),
    __metadata("design:type", String)
], CreateSystemAdministratorDto.prototype, "mobileNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: 'array',
        items: {
            type: 'string',
            enum: Object.values(enum_user_role_1.UserRole),
            example: enum_user_role_1.UserRole.SYSTEM_ADMINISTRATOR,
        },
        description: 'Roles assigned to the user',
    }),
    __metadata("design:type", Array)
], CreateSystemAdministratorDto.prototype, "roles", void 0);
//# sourceMappingURL=create-system-administrator.dto.js.map