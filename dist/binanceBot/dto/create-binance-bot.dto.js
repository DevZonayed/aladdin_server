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
exports.CreateBinanceBotDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const mongoose_1 = require("mongoose");
class CreateBinanceBotDto {
}
exports.CreateBinanceBotDto = CreateBinanceBotDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'Strategy account name',
        example: 'My Strategy Account',
        required: true,
    }),
    __metadata("design:type", String)
], CreateBinanceBotDto.prototype, "strategyAccauntName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: mongoose_1.Types.ObjectId,
        description: 'Strategy account ID',
        required: true,
    }),
    __metadata("design:type", mongoose_1.Types.ObjectId)
], CreateBinanceBotDto.prototype, "strategyAccaunt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [String],
        description: 'Strategy slugs',
        example: ['strategy-slug-1', 'strategy-slug-2'],
    }),
    __metadata("design:type", Array)
], CreateBinanceBotDto.prototype, "strategySlugs", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Boolean,
        description: 'Active status for each strategy slug',
        example: false,
    }),
    __metadata("design:type", Boolean)
], CreateBinanceBotDto.prototype, "isActive", void 0);
//# sourceMappingURL=create-binance-bot.dto.js.map