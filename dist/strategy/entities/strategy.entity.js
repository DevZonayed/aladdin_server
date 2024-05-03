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
exports.StrategySchema = exports.Strategy = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const max_position_interface_1 = require("../interfaces/max_position.interface");
let Strategy = class Strategy extends mongoose_2.Document {
};
exports.Strategy = Strategy;
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true, unique: true }),
    __metadata("design:type", String)
], Strategy.prototype, "StrategyName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Strategy.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String] }),
    __metadata("design:type", Array)
], Strategy.prototype, "bannedAssets", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String] }),
    __metadata("design:type", Array)
], Strategy.prototype, "allowAssets", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, unique: true, required: true, index: true }),
    __metadata("design:type", String)
], Strategy.prototype, "apiSlug", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, required: true }),
    __metadata("design:type", Number)
], Strategy.prototype, "capital", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true, uppercase: true, enum: ['MARKET', 'LIMIT'] }),
    __metadata("design:type", String)
], Strategy.prototype, "newOrderType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true, uppercase: true, enum: ['MARKET', 'LIMIT'] }),
    __metadata("design:type", String)
], Strategy.prototype, "partialOrderType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, required: true, default: false }),
    __metadata("design:type", Boolean)
], Strategy.prototype, "isolated", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, required: true }),
    __metadata("design:type", Number)
], Strategy.prototype, "minimumCapitalToSubscribe", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, required: true }),
    __metadata("design:type", Number)
], Strategy.prototype, "tradeMaxAmountPercentage", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], Strategy.prototype, "respectNotion", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, required: true }),
    __metadata("design:type", Number)
], Strategy.prototype, "tradeMaxLeverage", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: true }),
    __metadata("design:type", Boolean)
], Strategy.prototype, "reEntry", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], Strategy.prototype, "stopLoss", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 100, min: 1, max: 100 }),
    __metadata("design:type", Number)
], Strategy.prototype, "stopLossPercentage", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", Array)
], Strategy.prototype, "users", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], Strategy.prototype, "isRunning", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: max_position_interface_1.MaxPositionEntity, default: { includeOpen: false, max: 10 } }),
    __metadata("design:type", Object)
], Strategy.prototype, "maxPosition", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], Strategy.prototype, "stopNewOrder", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: "BOTH", enum: ['BUY', 'SELL', 'BOTH'] }),
    __metadata("design:type", String)
], Strategy.prototype, "prefaredSignalType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 3 }),
    __metadata("design:type", Number)
], Strategy.prototype, "maxReEntry", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 2 }),
    __metadata("design:type", Number)
], Strategy.prototype, "maxLongEntry", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 2 }),
    __metadata("design:type", Number)
], Strategy.prototype, "maxShortEntry", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], Strategy.prototype, "duplicateOrderBounced", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], Strategy.prototype, "startAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Strategy.prototype, "createdBy", void 0);
exports.Strategy = Strategy = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, versionKey: false })
], Strategy);
exports.StrategySchema = mongoose_1.SchemaFactory.createForClass(Strategy);
//# sourceMappingURL=strategy.entity.js.map