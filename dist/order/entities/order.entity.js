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
exports.OrderSchema = exports.Order = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const OrderSide_enum_1 = require("../enums/OrderSide.enum");
const closedBy_enum_1 = require("../enums/closedBy.enum");
const createdBy_enum_1 = require("../enums/createdBy.enum");
const orderType_enum_1 = require("../enums/orderType.enum");
const status_enum_1 = require("../enums/status.enum");
let Order = class Order extends mongoose_2.Document {
};
exports.Order = Order;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Order.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Strategy', index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Order.prototype, "strategyId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, index: true }),
    __metadata("design:type", String)
], Order.prototype, "copyOrderId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, index: true }),
    __metadata("design:type", String)
], Order.prototype, "binanceOrderId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Order.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: false }),
    __metadata("design:type", String)
], Order.prototype, "symbol", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], Order.prototype, "isRootOrder", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: false }),
    __metadata("design:type", String)
], Order.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: false }),
    __metadata("design:type", String)
], Order.prototype, "side", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Order.prototype, "closedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, required: true }),
    __metadata("design:type", Number)
], Order.prototype, "entryPrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, required: true }),
    __metadata("design:type", Number)
], Order.prototype, "orderQty", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], Order.prototype, "closedQty", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, required: true }),
    __metadata("design:type", Number)
], Order.prototype, "leverage", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, }),
    __metadata("design:type", Number)
], Order.prototype, "initialOrderRatio", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, required: true }),
    __metadata("design:type", Boolean)
], Order.prototype, "isolated", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true, default: status_enum_1.StatusEnum.OPEN }),
    __metadata("design:type", String)
], Order.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, }),
    __metadata("design:type", String)
], Order.prototype, "closeReason", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], Order.prototype, "reEntryCount", void 0);
exports.Order = Order = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, versionKey: false })
], Order);
exports.OrderSchema = mongoose_1.SchemaFactory.createForClass(Order);
//# sourceMappingURL=order.entity.js.map