"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const binance_module_1 = require("../binance/binance.module");
const strategy_module_1 = require("../strategy/strategy.module");
const user_module_1 = require("../user/user.module");
const bot_controller_1 = require("./controller/bot.controller");
const bot_entity_1 = require("./entities/bot.entity");
const bot_service_1 = require("./service/bot.service");
const worker_module_1 = require("./worker/worker.module");
let BotModule = class BotModule {
};
exports.BotModule = BotModule;
exports.BotModule = BotModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: 'Bot', schema: bot_entity_1.BotSchema },
            ]),
            user_module_1.UserModule,
            binance_module_1.BinanceModule,
            worker_module_1.WorkerModule,
            strategy_module_1.StrategyModule
        ],
        controllers: [bot_controller_1.BotController],
        providers: [bot_service_1.BotService],
    })
], BotModule);
//# sourceMappingURL=bot.module.js.map