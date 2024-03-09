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
exports.CreateOrderDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const status_enum_1 = require("../enums/status.enum");
class CreateOrderDto {
}
exports.CreateOrderDto = CreateOrderDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'Name of the symbol that you want to trade',
        example: 'SOLUSDT',
        required: true,
    }),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "symbol", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'Position side of your order',
        example: 'LONG',
        required: true,
    }),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "side", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'Order type of your position',
        example: 'LIMIT',
        required: true,
    }),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        description: 'Quantity of your order assets',
        example: 5,
        required: true,
    }),
    __metadata("design:type", Number)
], CreateOrderDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        description: 'Limit Price of your order',
        example: 100,
        required: true,
    }),
    __metadata("design:type", Number)
], CreateOrderDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        description: 'Leverage of your order',
        example: 5,
        required: true,
    }),
    __metadata("design:type", Number)
], CreateOrderDto.prototype, "leverage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        description: 'Order Ratio to parent ratio',
        example: null,
    }),
    __metadata("design:type", Number)
], CreateOrderDto.prototype, "initialOrderRatio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Boolean,
        description: 'Is the leverage should isolated or not',
        example: false,
        required: true,
    }),
    __metadata("design:type", Boolean)
], CreateOrderDto.prototype, "isolated", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        description: 'Number of reEntry',
        example: 0,
    }),
    __metadata("design:type", Number)
], CreateOrderDto.prototype, "reEntryCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        enum: status_enum_1.StatusEnum,
        description: 'Status of the order',
        example: false,
        default: status_enum_1.StatusEnum.OPEN
    }),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'Reason for the order close',
        example: "",
    }),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "closeReason", void 0);
//# sourceMappingURL=create-order.dto.js.map