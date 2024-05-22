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
exports.BotSchema = exports.Bot = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Bot = class Bot extends mongoose_2.Document {
};
exports.Bot = Bot;
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true, unique: true }),
    __metadata("design:type", String)
], Bot.prototype, "BotName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Bot.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], required: true }),
    __metadata("design:type", Array)
], Bot.prototype, "strategySlugs", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true, trim: true }),
    __metadata("design:type", String)
], Bot.prototype, "strategyId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true, trim: true }),
    __metadata("design:type", String)
], Bot.prototype, "p20t", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true, trim: true }),
    __metadata("design:type", String)
], Bot.prototype, "csrfToken", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, required: true, trim: true, default: 5000 }),
    __metadata("design:type", Number)
], Bot.prototype, "scrapInterval", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], Bot.prototype, "isPublic", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: false }),
    __metadata("design:type", Number)
], Bot.prototype, "runningOrders", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], Bot.prototype, "isRunning", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], Bot.prototype, "haveProxy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: false }),
    __metadata("design:type", String)
], Bot.prototype, "proxyUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], Bot.prototype, "startAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Bot.prototype, "createdBy", void 0);
exports.Bot = Bot = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, versionKey: false })
], Bot);
exports.BotSchema = mongoose_1.SchemaFactory.createForClass(Bot);
//# sourceMappingURL=bot.entity.js.map