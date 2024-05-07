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
exports.OrderController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const decorators_1 = require("../../common/decorators");
const data_search_decorator_1 = require("../../common/decorators/data-search.decorator");
const enum_1 = require("../../common/enum");
const enum_sort_by_1 = require("../../common/enum/enum-sort-by");
const guard_1 = require("../../common/guard");
const status_enum_1 = require("../enums/status.enum");
const order_service_1 = require("../service/order.service");
let OrderController = class OrderController {
    constructor(orderService) {
        this.orderService = orderService;
    }
    async findAllOpenOrderByStrategy(strategyId, page, limit, order, sort, search, startDate, endDate) {
        return this.orderService.findAllOpenOrderByStrategy(strategyId, page, limit, order, sort, search, startDate, endDate);
    }
    async closeOrder(orderId) {
        return this.orderService.update(orderId, { status: status_enum_1.StatusEnum.CLOSED });
    }
};
exports.OrderController = OrderController;
__decorate([
    (0, common_1.Get)('all-open-orders/:strategyId'),
    (0, data_search_decorator_1.DataSearchDecorator)([
        { name: 'startDate', type: Date, required: false, example: '2022-01-01' },
        { name: 'endDate', type: Date, required: false, example: '2022-02-01' },
    ]),
    (0, common_1.UseGuards)(guard_1.AuthGuard, guard_1.RolesGuard),
    (0, decorators_1.Roles)(enum_1.UserRole.SYSTEM_ADMINISTRATOR, enum_1.UserRole.ADMINISTRATOR),
    __param(0, (0, common_1.Param)('strategyId')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('order')),
    __param(4, (0, common_1.Query)('sort')),
    __param(5, (0, common_1.Query)('search')),
    __param(6, (0, common_1.Query)('startDate')),
    __param(7, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, String, String, String, Date,
        Date]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "findAllOpenOrderByStrategy", null);
__decorate([
    (0, common_1.Post)('close-order/:orderId'),
    (0, common_1.UseGuards)(guard_1.AuthGuard, guard_1.RolesGuard),
    (0, decorators_1.Roles)(enum_1.UserRole.SYSTEM_ADMINISTRATOR, enum_1.UserRole.ADMINISTRATOR),
    __param(0, (0, common_1.Param)('orderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "closeOrder", null);
exports.OrderController = OrderController = __decorate([
    (0, common_1.Controller)('order'),
    (0, swagger_1.ApiTags)('Order'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [order_service_1.OrderService])
], OrderController);
//# sourceMappingURL=order.controller.js.map