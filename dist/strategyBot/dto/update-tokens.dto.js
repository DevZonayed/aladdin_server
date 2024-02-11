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
exports.UpdateBotTokenDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class UpdateBotTokenDto {
}
exports.UpdateBotTokenDto = UpdateBotTokenDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'P20t token',
        example: "545543434",
    }),
    __metadata("design:type", String)
], UpdateBotTokenDto.prototype, "p20t", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'P2ot token',
        example: "545543434",
    }),
    __metadata("design:type", String)
], UpdateBotTokenDto.prototype, "csrfToken", void 0);
//# sourceMappingURL=update-tokens.dto.js.map