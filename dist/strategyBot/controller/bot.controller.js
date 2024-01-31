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
exports.BotController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const decorators_1 = require("../../common/decorators");
const data_search_decorator_1 = require("../../common/decorators/data-search.decorator");
const enum_1 = require("../../common/enum");
const enum_sort_by_1 = require("../../common/enum/enum-sort-by");
const guard_1 = require("../../common/guard");
const create_bot_dto_1 = require("../dto/create-bot.dto");
const update_bot_dto_1 = require("../dto/update-bot.dto");
const bot_service_1 = require("../service/bot.service");
let BotController = class BotController {
    constructor(BotService) {
        this.BotService = BotService;
    }
    async create(createStrategyDto, requestData) {
        let user = requestData["user"];
        let payload = {
            ...createStrategyDto,
            createdBy: user?.sub
        };
        return this.BotService.create(payload);
    }
    async start(requestData, id) {
        return this.BotService.handleStartBot(id);
    }
    async stop(requestData, id) {
        return this.BotService.handleStopBot(id);
    }
    async getBotStatus(requestData, id) {
        return this.BotService.getBotStatus(id);
    }
    async findAll(page, limit, order, sort, search, startDate, endDate) {
        return this.BotService.findAll(page, limit, order, sort, search, startDate, endDate);
    }
    async findOne(id) {
        return this.BotService.findOne(id);
    }
    async update(id, updateStrategyDto) {
        return this.BotService.update(id, updateStrategyDto);
    }
    async remove(id) {
        return this.BotService.remove(id);
    }
};
exports.BotController = BotController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(guard_1.AuthGuard, guard_1.RolesGuard),
    (0, decorators_1.Roles)(enum_1.UserRole.SYSTEM_ADMINISTRATOR, enum_1.UserRole.ADMINISTRATOR),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_bot_dto_1.CreateBotDto,
        Request]),
    __metadata("design:returntype", Promise)
], BotController.prototype, "create", null);
__decorate([
    (0, common_1.Post)("/start/:id"),
    (0, common_1.UseGuards)(guard_1.AuthGuard, guard_1.RolesGuard),
    (0, decorators_1.Roles)(enum_1.UserRole.SYSTEM_ADMINISTRATOR, enum_1.UserRole.ADMINISTRATOR),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Request, String]),
    __metadata("design:returntype", Promise)
], BotController.prototype, "start", null);
__decorate([
    (0, common_1.Post)("/stop/:id"),
    (0, common_1.UseGuards)(guard_1.AuthGuard, guard_1.RolesGuard),
    (0, decorators_1.Roles)(enum_1.UserRole.SYSTEM_ADMINISTRATOR, enum_1.UserRole.ADMINISTRATOR),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Request, String]),
    __metadata("design:returntype", Promise)
], BotController.prototype, "stop", null);
__decorate([
    (0, common_1.Post)("/status/:id"),
    (0, common_1.UseGuards)(guard_1.AuthGuard, guard_1.RolesGuard),
    (0, decorators_1.Roles)(enum_1.UserRole.SYSTEM_ADMINISTRATOR, enum_1.UserRole.ADMINISTRATOR),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Request, String]),
    __metadata("design:returntype", Promise)
], BotController.prototype, "getBotStatus", null);
__decorate([
    (0, common_1.Get)(),
    (0, data_search_decorator_1.DataSearchDecorator)([
        { name: 'startDate', type: Date, required: false, example: '2022-01-01' },
        { name: 'endDate', type: Date, required: false, example: '2022-02-01' },
    ]),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('order')),
    __param(3, (0, common_1.Query)('sort')),
    __param(4, (0, common_1.Query)('search')),
    __param(5, (0, common_1.Query)('startDate')),
    __param(6, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String, Date,
        Date]),
    __metadata("design:returntype", Promise)
], BotController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BotController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(guard_1.AuthGuard, guard_1.RolesGuard),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('StrategyImage')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_bot_dto_1.UpdateBotDto]),
    __metadata("design:returntype", Promise)
], BotController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(guard_1.AuthGuard, guard_1.RolesGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BotController.prototype, "remove", null);
exports.BotController = BotController = __decorate([
    (0, common_1.Controller)('bot'),
    (0, swagger_1.ApiTags)('Bot'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [bot_service_1.BotService])
], BotController);
//# sourceMappingURL=bot.controller.js.map