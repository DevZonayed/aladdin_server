"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrategyModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const binance_module_1 = require("../binance/binance.module");
const user_module_1 = require("../user/user.module");
const strategy_controller_1 = require("./controller/strategy.controller");
const strategy_entity_1 = require("./entities/strategy.entity");
const strategy_service_1 = require("./service/strategy.service");
let StrategyModule = class StrategyModule {
};
exports.StrategyModule = StrategyModule;
exports.StrategyModule = StrategyModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: 'Strategy', schema: strategy_entity_1.StrategySchema },
            ]),
            user_module_1.UserModule,
            binance_module_1.BinanceModule
        ],
        controllers: [strategy_controller_1.StrategyController],
        providers: [strategy_service_1.StrategyService],
    })
], StrategyModule);
//# sourceMappingURL=strategy.module.js.map