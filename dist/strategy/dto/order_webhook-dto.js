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
exports.OrderWebHookDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class OrderWebHookDto {
}
exports.OrderWebHookDto = OrderWebHookDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'Id of the order',
        example: 'filmango_btcusdt_short',
        required: true,
    }),
    __metadata("design:type", String)
], OrderWebHookDto.prototype, "copyOrderId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'Type of the signal',
        example: 'NEW | RE_ENTRY | PARTIAL_CLOSE | CLOSE',
        required: true,
    }),
    __metadata("design:type", String)
], OrderWebHookDto.prototype, "signalType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'Name of the symbol that you want to trade',
        example: 'SOLUSDT',
        required: true,
    }),
    __metadata("design:type", String)
], OrderWebHookDto.prototype, "symbol", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'Position side of your order',
        example: 'LONG',
        required: true,
    }),
    __metadata("design:type", String)
], OrderWebHookDto.prototype, "side", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'Order type of your position',
        example: 'LIMIT',
        required: true,
    }),
    __metadata("design:type", String)
], OrderWebHookDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        description: 'Quantity of your order assets',
        example: 5,
        required: true,
    }),
    __metadata("design:type", Number)
], OrderWebHookDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        description: 'Limit Price of your order',
        example: 100,
        required: true,
    }),
    __metadata("design:type", Number)
], OrderWebHookDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        description: 'Leverage of your order',
        example: 5,
        required: true,
    }),
    __metadata("design:type", Number)
], OrderWebHookDto.prototype, "leverage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Boolean,
        description: 'Is the leverage should isolated or not',
        example: false,
        required: true,
    }),
    __metadata("design:type", Boolean)
], OrderWebHookDto.prototype, "isolated", void 0);
//# sourceMappingURL=order_webhook-dto.js.map