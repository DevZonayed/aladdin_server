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
exports.BinanceService = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("../../common/constants");
const order_service_1 = require("../../order/service/order.service");
const user_service_1 = require("../../user/service/user.service");
const trade_calculations_1 = require("../utils/trade.calculations");
const Binance = require('node-binance-api');
let BinanceService = class BinanceService {
    constructor(userService, orderService) {
        this.userService = userService;
        this.orderService = orderService;
    }
    async checkBalance(apiKey, secretKey) {
        return await this.binanceApiHandler(apiKey, secretKey, async (binance, binanceTest) => {
            const safeApiCall = (apiCall, identifier) => {
                return apiCall.then(result => ({ result, identifier, success: true }), error => ({ error, identifier, success: false }));
            };
            const originalApiPromise = safeApiCall(binance.futuresBalance(), 'Original API');
            const testnetApiPromise = safeApiCall(binanceTest.futuresBalance(), 'Testnet API');
            const results = await Promise.all([originalApiPromise, testnetApiPromise]);
            const successfulResults = results.filter(r => r.success && !r.result.code);
            if (successfulResults.length > 0) {
                const { result, identifier } = successfulResults[0];
                if (Array.isArray(result) && result.length > 0) {
                    const usdtBalance = result.find(b => b.asset === "USDT");
                    return {
                        balance: usdtBalance ? usdtBalance.balance : 0,
                        isTestMode: identifier == "Testnet API",
                    };
                }
                else {
                    throw new Error("Invalid API response: " + result.msg);
                }
            }
            else {
                throw new Error("Invalid Api Key or Secret Key");
            }
        });
    }
    async createOrder(strategy, credentials, orderDto) {
        let { apiKey, apiSecret, isTestMode, _id: userId } = credentials;
        return await this.binanceApiHandler(apiKey, apiSecret, async (binance, binanceTest) => {
            try {
                let { balance } = await this.userService.getBinanceBalance(userId);
                let instance = isTestMode ? binanceTest : binance;
                let { symbol, side, type, quantity, price, leverage, isolated } = orderDto;
                if (!symbol || !side || !type || !quantity || !price) {
                    throw new Error("Missing required parameters");
                }
                let amounPercentage = (0, trade_calculations_1.calculateParentTradePercentage)(strategy.capital, quantity, price);
                let [qty, cost] = (0, trade_calculations_1.calculateTradeDetailsForUser)(balance, amounPercentage, price);
                if (cost > strategy.tradeMaxAmount) {
                    cost = strategy.tradeMaxAmount;
                    quantity = (0, trade_calculations_1.calculateQuantity)(cost, price);
                }
                else {
                    quantity = qty;
                }
                if (leverage > strategy.tradeMaxLeverage) {
                    leverage = strategy.tradeMaxLeverage;
                }
                let order = await instance.futuresOrder(side, symbol, quantity, price, {
                    type,
                });
                console.log(order);
                if (order?.code) {
                    return {
                        userId,
                        success: false,
                        message: order.msg
                    };
                }
                return {
                    userId,
                    order,
                    success: true
                };
            }
            catch (err) {
                console.log(err);
                return {
                    userId,
                    success: false,
                    message: err.msg
                };
            }
        });
    }
    async createStrategyOrders(strategy, userCredentials, OrderWebHookDto) {
        let credentials = userCredentials.map(user => ({ _id: user._id, apiKey: user?.binanceCredentials?.apiKey, apiSecret: user?.binanceCredentials?.apiSecret, isTestMode: user?.binanceCredentials?.isTestMode }));
        let finalCredentials = credentials.filter(credential => credential.apiKey && credential.apiSecret);
        if (finalCredentials.length == 0) {
            throw new Error("No valid credentials found");
        }
        let accauntOrderPromises = finalCredentials.map(async (credential) => {
            return await this.createOrder(strategy, credential, OrderWebHookDto);
        });
        let result = await Promise.all(accauntOrderPromises);
        console.log(result);
        return result;
    }
    async binanceApiHandler(apiKey, secretKey, action) {
        if (!apiKey || !secretKey) {
            throw new Error(constants_1.INVALID_BINANCE_CREDENTIALS);
        }
        let binance = null;
        let binanceTest = null;
        try {
            binance = new Binance();
            binanceTest = new Binance();
            binanceTest.options({
                APIKEY: apiKey,
                APISECRET: secretKey,
                useServerTime: true,
                test: true,
                baseURL: "https://testnet.binancefuture.com",
            });
            binance.options({
                APIKEY: apiKey,
                APISECRET: secretKey,
                useServerTime: true
            });
            return await action(binance, binanceTest);
        }
        catch (err) {
            throw err;
        }
        finally {
            binance = null;
            binanceTest = null;
        }
    }
};
exports.BinanceService = BinanceService;
exports.BinanceService = BinanceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => user_service_1.UserService))),
    __metadata("design:paramtypes", [user_service_1.UserService,
        order_service_1.OrderService])
], BinanceService);
//# sourceMappingURL=binance.service.js.map