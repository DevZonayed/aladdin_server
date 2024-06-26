"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BinanceModule = void 0;
const common_1 = require("@nestjs/common");
const notification_module_1 = require("../notification/mail/notification.module");
const order_module_1 = require("../order/order.module");
const strategy_module_1 = require("../strategy/strategy.module");
const user_module_1 = require("../user/user.module");
const binance_service_1 = require("./service/binance.service");
let BinanceModule = class BinanceModule {
};
exports.BinanceModule = BinanceModule;
exports.BinanceModule = BinanceModule = __decorate([
    (0, common_1.Module)({
        imports: [order_module_1.OrderModule, (0, common_1.forwardRef)(() => user_module_1.UserModule), (0, common_1.forwardRef)(() => strategy_module_1.StrategyModule), (0, common_1.forwardRef)(() => notification_module_1.NotificationModule)],
        controllers: [],
        providers: [binance_service_1.BinanceService],
        exports: [binance_service_1.BinanceService],
    })
], BinanceModule);
//# sourceMappingURL=binance.module.js.map