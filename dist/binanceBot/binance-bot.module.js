"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BinanceBotModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const binance_bot_controller_1 = require("./controller/binance-bot.controller");
const binance_bot_entity_1 = require("./entities/binance-bot.entity");
const binance_bot_service_1 = require("./service/binance-bot.service");
let BinanceBotModule = class BinanceBotModule {
};
exports.BinanceBotModule = BinanceBotModule;
exports.BinanceBotModule = BinanceBotModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: binance_bot_entity_1.BinanceBot.name, schema: binance_bot_entity_1.BinanceBotSchema },
            ]),
        ],
        controllers: [binance_bot_controller_1.BinanceBotController],
        providers: [binance_bot_service_1.BinanceBotService],
    })
], BinanceBotModule);
//# sourceMappingURL=binance-bot.module.js.map