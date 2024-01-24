"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BinanceService = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("../../common/constants");
const binance_constants_1 = require("../constants/binance.constants");
const Binance = require('node-binance-api');
let BinanceService = class BinanceService {
    async checkBalance(apiKey, secretKey) {
        return await this.binanceApiHandler(apiKey, secretKey, async (binance) => {
            let balances = await binance.futuresBalance() || [];
            let usdtBalance = balances?.filter((b) => b?.asset === "USDT")[0];
            return usdtBalance ? usdtBalance.balance : 0;
        });
    }
    async binanceApiHandler(apiKey, secretKey, action) {
        if (!apiKey || !secretKey) {
            throw new Error(constants_1.INVALID_BINANCE_CREDENTIALS);
        }
        let binance = null;
        try {
            binance = new Binance();
            binance.options({
                APIKEY: apiKey,
                APISECRET: secretKey,
                baseURL: binance_constants_1.BINANCE_FUTURE_BASE_URL_WITH_PROXY
            });
            return await action(binance);
        }
        catch (err) {
            throw err;
        }
        finally {
            binance = null;
        }
    }
};
exports.BinanceService = BinanceService;
exports.BinanceService = BinanceService = __decorate([
    (0, common_1.Injectable)()
], BinanceService);
//# sourceMappingURL=binance.service.js.map