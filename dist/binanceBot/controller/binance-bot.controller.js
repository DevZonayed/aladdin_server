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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BinanceBotController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const decorators_1 = require("../../common/decorators");
const enum_1 = require("../../common/enum");
const guard_1 = require("../../common/guard");
const create_binance_bot_dto_1 = require("../dto/create-binance-bot.dto");
const update_binance_bot_dto_1 = require("../dto/update-binance-bot.dto");
const binance_bot_service_1 = require("../service/binance-bot.service");
let BinanceBotController = class BinanceBotController {
    constructor(binanceBotService) {
        this.binanceBotService = binanceBotService;
    }
    async create(createBinanceBotDto) {
        return this.binanceBotService.create(createBinanceBotDto);
    }
    async findAll() {
        return this.binanceBotService.findAll();
    }
    async findOne(id) {
        return this.binanceBotService.findOne(id);
    }
    async update(id, updateBinanceBotDto) {
        return this.binanceBotService.update(id, updateBinanceBotDto);
    }
    async remove(id) {
        return this.binanceBotService.remove(id);
    }
};
exports.BinanceBotController = BinanceBotController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(guard_1.AuthGuard, guard_1.RolesGuard),
    (0, decorators_1.Roles)(enum_1.UserRole.SYSTEM_ADMINISTRATOR),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_binance_bot_dto_1.CreateBinanceBotDto]),
    __metadata("design:returntype", Promise)
], BinanceBotController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(guard_1.AuthGuard, guard_1.RolesGuard),
    (0, decorators_1.Roles)(enum_1.UserRole.SYSTEM_ADMINISTRATOR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BinanceBotController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(guard_1.AuthGuard, guard_1.RolesGuard),
    (0, decorators_1.Roles)(enum_1.UserRole.SYSTEM_ADMINISTRATOR),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BinanceBotController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(guard_1.AuthGuard, guard_1.RolesGuard),
    (0, decorators_1.Roles)(enum_1.UserRole.SYSTEM_ADMINISTRATOR),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_binance_bot_dto_1.UpdateBinanceBotDto]),
    __metadata("design:returntype", Promise)
], BinanceBotController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(guard_1.AuthGuard, guard_1.RolesGuard),
    (0, decorators_1.Roles)(enum_1.UserRole.SYSTEM_ADMINISTRATOR),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BinanceBotController.prototype, "remove", null);
exports.BinanceBotController = BinanceBotController = __decorate([
    (0, common_1.Controller)('binance-bot'),
    (0, swagger_1.ApiTags)('BinanceBot'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [binance_bot_service_1.BinanceBotService])
], BinanceBotController);
//# sourceMappingURL=binance-bot.controller.js.map