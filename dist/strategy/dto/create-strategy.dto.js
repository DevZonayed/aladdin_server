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
exports.CreateStrategyDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const BinanceEnum_1 = require("../../binance/enum/BinanceEnum");
const max_position_interface_1 = require("../interfaces/max_position.interface");
class CreateStrategyDto {
}
exports.CreateStrategyDto = CreateStrategyDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'Name of the Strategy',
        example: 'Demo Strategy',
        required: true,
    }),
    __metadata("design:type", String)
], CreateStrategyDto.prototype, "StrategyName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'Description of the Strategy',
        example: 'This strategy will work with multiple coins and reEntry',
    }),
    __metadata("design:type", String)
], CreateStrategyDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'Banned Assets, That you not to order',
        example: [],
    }),
    __metadata("design:type", Array)
], CreateStrategyDto.prototype, "bannedAssets", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'Allowed Assets, that you only wanna order on',
        example: [],
    }),
    __metadata("design:type", Array)
], CreateStrategyDto.prototype, "allowAssets", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'Api Endpoint of the strategy',
        example: "demo-1",
        required: true
    }),
    __metadata("design:type", String)
], CreateStrategyDto.prototype, "apiSlug", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        description: 'Capital amount of the strategy to calculate',
        example: 1000,
        required: true
    }),
    __metadata("design:type", Number)
], CreateStrategyDto.prototype, "capital", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Boolean,
        description: 'Is the leverage would be isolated or not',
        example: false,
        required: true
    }),
    __metadata("design:type", Number)
], CreateStrategyDto.prototype, "isolated", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'Order type for new order',
        example: BinanceEnum_1.PositionTypeEnum.LIMIT,
        required: true,
    }),
    __metadata("design:type", String)
], CreateStrategyDto.prototype, "newOrderType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'Order type for partial Entry',
        example: BinanceEnum_1.PositionTypeEnum.LIMIT,
        required: true,
    }),
    __metadata("design:type", String)
], CreateStrategyDto.prototype, "partialOrderType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        description: 'Required capital for subscribe this strategy',
        example: 1000,
        required: true
    }),
    __metadata("design:type", Number)
], CreateStrategyDto.prototype, "minimumCapitalToSubscribe", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Boolean,
        description: 'Maximum amount for per trade',
        example: false,
        required: true
    }),
    __metadata("design:type", Boolean)
], CreateStrategyDto.prototype, "respectNotion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        description: 'Maximum leverage for per trade',
        example: 10,
        required: true
    }),
    __metadata("design:type", Number)
], CreateStrategyDto.prototype, "tradeMaxLeverage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        description: 'Maximum amount for per trade',
        example: 10,
        required: true
    }),
    __metadata("design:type", Number)
], CreateStrategyDto.prototype, "tradeMaxAmountPercentage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        description: 'Maximum ReEntry Allowed to this strategy',
        example: 4,
        required: true
    }),
    __metadata("design:type", Number)
], CreateStrategyDto.prototype, "maxReEntry", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        description: 'Maximum Short Positions Allowed to this strategy',
        example: 4,
        required: true
    }),
    __metadata("design:type", Number)
], CreateStrategyDto.prototype, "maxLongPosition", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        description: 'Maximum Long Positions Allowed to this strategy',
        example: 4,
        required: true
    }),
    __metadata("design:type", Number)
], CreateStrategyDto.prototype, "maxShortPosition", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Boolean,
        description: 'Is this strategy work with re entry',
        example: true
    }),
    __metadata("design:type", Boolean)
], CreateStrategyDto.prototype, "reEntry", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Boolean,
        description: 'Should it apply with stop loss also',
        example: true
    }),
    __metadata("design:type", Boolean)
], CreateStrategyDto.prototype, "stopLoss", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Boolean,
        description: 'Should it take new order',
        example: false,
        default: false
    }),
    __metadata("design:type", Boolean)
], CreateStrategyDto.prototype, "stopNewOrder", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'What Signal type Do You Prefer for this strategy',
        example: "BOTH",
        default: "BOTH",
        enum: ["LONG", "SHORT", "BOTH"]
    }),
    __metadata("design:type", String)
], CreateStrategyDto.prototype, "prefaredSignalType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: max_position_interface_1.MaxPositionEntity,
        description: 'Maximum position limit of the strategy',
        example: {
            includeOpen: false,
            max: 10
        }
    }),
    __metadata("design:type", Object)
], CreateStrategyDto.prototype, "maxPosition", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        description: 'What should be the maximum lose percentage',
        example: 100
    }),
    __metadata("design:type", Number)
], CreateStrategyDto.prototype, "stopLossPercentage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'ID of the user who created the bucket category',
        example: '60c6e2349a0cdc40f8b5f4d2',
    }),
    __metadata("design:type", String)
], CreateStrategyDto.prototype, "createdBy", void 0);
//# sourceMappingURL=create-strategy.dto.js.map