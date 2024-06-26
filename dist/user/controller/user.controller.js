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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const data_search_decorator_1 = require("../../common/decorators/data-search.decorator");
const enum_sort_by_1 = require("../../common/enum/enum-sort-by");
const decorators_1 = require("../../common/decorators");
const enum_1 = require("../../common/enum");
const guard_1 = require("../../common/guard");
const auth_guard_1 = require("../../common/guard/auth.guard");
const create_user_dto_1 = require("../dto/create-user.dto");
const sub_unsub_strategy_dto_1 = require("../dto/sub-unsub-strategy.dto");
const update_user_credentials_dto_1 = require("../dto/update-user-credentials.dto");
const update_user_dto_1 = require("../dto/update-user.dto");
const user_service_1 = require("../service/user.service");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    create(createUserDto) {
        return this.userService.create(createUserDto);
    }
    updateBinanceCredentials(request, updateBinanceCredentials) {
        let user = request["user"];
        return this.userService.updateBinanceCredentials(user.sub, updateBinanceCredentials);
    }
    subscribeToAStrategy(request, subUnsubStrategyDto) {
        let user = request["user"];
        let strategyId = subUnsubStrategyDto.strategyId;
        return this.userService.subscribeToStrategy(user.sub, strategyId);
    }
    unSubscribeToAStrategy(request, subUnsubStrategyDto) {
        let user = request["user"];
        let strategyId = subUnsubStrategyDto.strategyId;
        return this.userService.unSubscribeToStrategy(user.sub, strategyId);
    }
    async findAll(page, limit, order, sort, search, startDate, endDate) {
        return this.userService.findAll(page, limit, order, sort, search, startDate, endDate);
    }
    findOne(id) {
        return this.userService.findOne(id);
    }
    update(id, updateUserDto) {
        return this.userService.update(id, updateUserDto);
    }
    remove(id) {
        return this.userService.remove(id);
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('binance-credentials'),
    (0, decorators_1.Roles)(enum_1.UserRole.USER, enum_1.UserRole.SYSTEM_ADMINISTRATOR, enum_1.UserRole.PRO_USER, enum_1.UserRole.ADMINISTRATOR),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_user_credentials_dto_1.UpdateUserCredentialsDto]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "updateBinanceCredentials", null);
__decorate([
    (0, common_1.Post)('subscribe-to-strategy'),
    (0, decorators_1.Roles)(enum_1.UserRole.USER, enum_1.UserRole.SYSTEM_ADMINISTRATOR, enum_1.UserRole.PRO_USER, enum_1.UserRole.ADMINISTRATOR),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, sub_unsub_strategy_dto_1.SubUnsubStrategyDto]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "subscribeToAStrategy", null);
__decorate([
    (0, common_1.Post)('unsubscribe-to-strategy'),
    (0, decorators_1.Roles)(enum_1.UserRole.USER, enum_1.UserRole.SYSTEM_ADMINISTRATOR, enum_1.UserRole.PRO_USER, enum_1.UserRole.ADMINISTRATOR),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, sub_unsub_strategy_dto_1.SubUnsubStrategyDto]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "unSubscribeToAStrategy", null);
__decorate([
    (0, common_1.Get)(),
    (0, decorators_1.Roles)(enum_1.UserRole.ADMINISTRATOR, enum_1.UserRole.SYSTEM_ADMINISTRATOR),
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
], UserController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, decorators_1.Roles)(enum_1.UserRole.ADMINISTRATOR, enum_1.UserRole.SYSTEM_ADMINISTRATOR),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, decorators_1.Roles)(enum_1.UserRole.SYSTEM_ADMINISTRATOR),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, decorators_1.Roles)(enum_1.UserRole.SYSTEM_ADMINISTRATOR),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "remove", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('user'),
    (0, swagger_1.ApiTags)('User'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, guard_1.RolesGuard),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map