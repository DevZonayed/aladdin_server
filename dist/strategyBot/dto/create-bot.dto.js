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
exports.CreateBotDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class CreateBotDto {
}
exports.CreateBotDto = CreateBotDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'Name of the Bot',
        example: 'Demo Bot',
        required: true,
    }),
    __metadata("design:type", String)
], CreateBotDto.prototype, "BotName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'Description of the Bot',
        example: 'This Bot will work with multiple coins and reEntry',
    }),
    __metadata("design:type", String)
], CreateBotDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'The Stratefy Slug that you want to add on this bot',
        example: "demo-1",
    }),
    __metadata("design:type", String)
], CreateBotDto.prototype, "strategySlug", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'The Id of the Binance Strategy ID',
        example: "545543434",
    }),
    __metadata("design:type", String)
], CreateBotDto.prototype, "strategyId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'P2ot token',
        example: "545543434",
    }),
    __metadata("design:type", String)
], CreateBotDto.prototype, "p2ot", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'P2ot token',
        example: "545543434",
    }),
    __metadata("design:type", String)
], CreateBotDto.prototype, "csrfToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Boolean,
        description: 'Is the strategy of b is Public?',
        example: true,
        required: true
    }),
    __metadata("design:type", Number)
], CreateBotDto.prototype, "isPublic", void 0);
//# sourceMappingURL=create-bot.dto.js.map