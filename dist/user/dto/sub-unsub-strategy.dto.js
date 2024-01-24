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
exports.SubUnsubStrategyDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const mongoose_1 = require("mongoose");
class SubUnsubStrategyDto {
}
exports.SubUnsubStrategyDto = SubUnsubStrategyDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '65ae2da5d1509f2489903a0f' }),
    __metadata("design:type", mongoose_1.Types.ObjectId)
], SubUnsubStrategyDto.prototype, "strategyId", void 0);
//# sourceMappingURL=sub-unsub-strategy.dto.js.map