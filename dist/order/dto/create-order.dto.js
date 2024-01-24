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
const enum_order_status_1 = require("../../common/enum/enum-order-status");
const enum_payment_account_type_1 = require("../../common/enum/enum-payment-account-type");
const enum_payment_status_1 = require("../../common/enum/enum-payment-status");
class CreateOrderDto {
}
exports.CreateOrderDto = CreateOrderDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'ID of the user who placed the order',
        example: '60c6e2349a0cdc40f8b5f4d2',
        required: true,
    }),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "orderBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'ID of the surprised bucket in the order',
        example: '60c6e2349a0cdc40f8b5f4d3',
        required: true,
    }),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "bucketName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'ID of the restaurant for the order',
        example: '60c6e2349a0cdc40f8b5f4d4',
        required: true,
    }),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "restaurant", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        description: 'Quantity of items in the order',
        example: 2,
    }),
    __metadata("design:type", Number)
], CreateOrderDto.prototype, "qty", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        description: 'Unit amount for each item',
        example: 10,
    }),
    __metadata("design:type", Number)
], CreateOrderDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'Type of payment account',
        enum: enum_payment_account_type_1.PaymentAccountType,
        example: enum_payment_account_type_1.PaymentAccountType.STRIPE,
    }),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "paymentAccountType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'Payment status of the order',
        enum: enum_payment_status_1.PaymentStatus,
        example: enum_payment_status_1.PaymentStatus.PENDING,
    }),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "paymentStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'Status of the order',
        enum: enum_order_status_1.OrderStatus,
        example: enum_order_status_1.OrderStatus.SUCCESS,
    }),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "orderStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Boolean,
        description: 'Whether the order is refundable',
        example: true,
    }),
    __metadata("design:type", Boolean)
], CreateOrderDto.prototype, "isRefundable", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'Transaction ID for the order',
        example: 'txn_12345',
    }),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "transactionID", void 0);
//# sourceMappingURL=create-order.dto.js.map