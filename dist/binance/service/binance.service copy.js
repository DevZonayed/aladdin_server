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
const cache_manager_1 = require("@nestjs/cache-manager");
const common_1 = require("@nestjs/common");
const constants_1 = require("../../common/constants");
const createdBy_enum_1 = require("../../order/enums/createdBy.enum");
const status_enum_1 = require("../../order/enums/status.enum");
const order_service_1 = require("../../order/service/order.service");
const user_service_1 = require("../../user/service/user.service");
const BinanceEnum_1 = require("../enum/BinanceEnum");
const trade_calculations_1 = require("../utils/trade.calculations");
const exchangeInfo_service_1 = require("./exchangeInfo.service");
const Binance = require('node-binance-api');
let BinanceService = class BinanceService {
    constructor(userService, orderService, cacheService) {
        this.userService = userService;
        this.orderService = orderService;
        this.cacheService = cacheService;
        this.binanceExchaneService = new exchangeInfo_service_1.BinanceExchaneService(cacheService);
    }
    async checkBalance(apiKey, secretKey) {
        return await this.binanceApiHandler(apiKey, secretKey, async (binance, binanceTest) => {
            try {
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
                    let errorMessage = "\n";
                    results.map(item => {
                        errorMessage += item?.error?.message || item.result.msg + "\n";
                    });
                    throw new Error("Error Occured in balance checking: " + errorMessage);
                }
            }
            catch (err) {
                throw new Error(err.message);
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
            return await this.createFutureOrder(strategy, credential, OrderWebHookDto);
        });
        let binanceOrderResult = await Promise.all(accauntOrderPromises);
        let saveResult = await this.saveOrders(binanceOrderResult);
        return saveResult;
    }
    async saveOrders(results) {
        let orderSavePromises = results.map(async (result) => {
            let { userId = undefined, orderDto = undefined, success = undefined, message = undefined, order = undefined, ratio = undefined, strategy = undefined } = result;
            let existOrder = await this.orderService.findOpenOrder(strategy._id, orderDto.copyOrderId, userId, orderDto.symbol, orderDto.side);
            if (existOrder.status) {
                let orderData = existOrder.data;
                let totalOrderQuantity = orderData.orderQty;
                let updatePayload = {};
                if (orderDto.signalType == BinanceEnum_1.SignalTypeEnum.PARTIAL_CLOSE) {
                    let closedQuantity = orderData.closedQty;
                    if (Array.isArray(order)) {
                        order.forEach(item => {
                            closedQuantity += Number(item?.origQty);
                        });
                    }
                    else if (Object.keys(order).includes("origQty")) {
                        closedQuantity += Number(order?.origQty);
                    }
                    else {
                        closedQuantity += Number(orderDto.quantity);
                    }
                    if (totalOrderQuantity <= closedQuantity) {
                        updatePayload = {
                            ...updatePayload,
                            closedQty: closedQuantity,
                            status: status_enum_1.StatusEnum.CLOSED,
                            closeReason: BinanceEnum_1.SignalTypeEnum.PARTIAL_CLOSE + " Close Quantity is more then order quantity",
                        };
                    }
                    else {
                        updatePayload = {
                            ...updatePayload,
                            closedQty: closedQuantity,
                        };
                    }
                }
                else {
                    if (Object.keys(order).includes("origQty")) {
                        totalOrderQuantity += Number(order?.origQty);
                    }
                    else {
                        totalOrderQuantity += Number(orderDto.quantity);
                    }
                    updatePayload = {
                        orderQty: totalOrderQuantity
                    };
                }
                let updateResult = await this.orderService.update(orderData._id, updatePayload);
                if (updateResult.payload) {
                    return {
                        success: true,
                        message: "Order Updated Successfully",
                    };
                }
                else {
                    throw Error("Order Update To Database Failed!");
                }
            }
            let payload = {};
            if (success) {
                payload = {
                    userId: userId,
                    strategyId: strategy._id,
                    copyOrderId: orderDto.copyOrderId,
                    binanceOrderId: order.orderId,
                    createdBy: createdBy_enum_1.CreatedByEnum.STRATEGY,
                    symbol: orderDto.symbol,
                    type: orderDto.type,
                    side: orderDto.side,
                    entryPrice: order.price,
                    orderQty: order.origQty,
                    leverage: orderDto.leverage,
                    isolated: orderDto.isolated,
                    initialOrderRatio: ratio
                };
            }
            else {
                payload = {
                    userId: userId,
                    strategyId: strategy._id,
                    copyOrderId: orderDto.copyOrderId,
                    binanceOrderId: null,
                    createdBy: createdBy_enum_1.CreatedByEnum.STRATEGY,
                    symbol: orderDto.symbol,
                    type: orderDto.type,
                    side: orderDto.side,
                    entryPrice: orderDto.price,
                    orderQty: null,
                    leverage: orderDto.leverage,
                    isolated: orderDto.isolated,
                    status: status_enum_1.StatusEnum.CLOSED,
                    closeReason: message
                };
            }
            return this.orderService.create(payload);
        });
        return await Promise.all(orderSavePromises);
    }
    async createFutureOrder(strategy, credentials, orderDto) {
        let { apiKey, apiSecret, isTestMode, _id: userId } = credentials;
        return await this.binanceApiHandler(apiKey, apiSecret, async (binance, binanceTest) => {
            try {
                let { symbol, side, type, quantity, price, leverage, isolated, signalType } = orderDto;
                if (!symbol || !side || !type || !quantity || !price || !signalType) {
                    throw new Error("Missing required parameters");
                }
                symbol = symbol.toUpperCase();
                side = side.toUpperCase();
                signalType = signalType.toUpperCase();
                type = type.toUpperCase();
                if (!Object.values(BinanceEnum_1.SignalTypeEnum).includes(signalType)) {
                    throw new Error("Invalid Signal Type");
                }
                let binanceBalance = this.userService.getBinanceBalance(userId);
                let prevOrder = this.orderService.findOpenOrder(strategy._id, orderDto.copyOrderId, userId, orderDto.symbol, orderDto.side);
                let [binanceBalanceRes, prevOrderRes] = await Promise.all([binanceBalance, prevOrder]);
                let instance = isTestMode ? binanceTest : binance;
                let rootTradeAmount = Number(price) * Number(quantity);
                let rootTradeCapital = Number(strategy.capital);
                let myCapital = Number(binanceBalanceRes?.balance);
                let maxTradeAmount = Number(strategy.tradeMaxAmount);
                let orderRatio = prevOrderRes.status ? Number(prevOrderRes.data.initialOrderRatio) : null;
                let { tradeAmount: accauntTradeAmount, ratio } = (0, trade_calculations_1.calculateMyTradeAmount)(rootTradeAmount, rootTradeCapital, myCapital, maxTradeAmount, orderRatio);
                quantity = (0, trade_calculations_1.calculateQuantity)(accauntTradeAmount, price);
                quantity = await this.binanceExchaneService.formatQuantity(symbol, quantity);
                price = await this.binanceExchaneService.formatPrice(symbol, price);
                await this.setLeverageAndMarginType(instance, symbol, leverage, isolated, userId);
                let order = "";
                if ((signalType == BinanceEnum_1.SignalTypeEnum.NEW || signalType == BinanceEnum_1.SignalTypeEnum.RE_ENTRY)
                    && side == BinanceEnum_1.PositionSideEnum.LONG) {
                    order = await this.placeFutureBuyOrder(instance, symbol, side, type, quantity, price);
                }
                else if ((signalType == BinanceEnum_1.SignalTypeEnum.NEW || signalType == BinanceEnum_1.SignalTypeEnum.RE_ENTRY)
                    && side == BinanceEnum_1.PositionSideEnum.SHORT) {
                    order = await this.placeFutureSellOrder(instance, symbol, side, type, quantity, price);
                }
                else if (signalType == BinanceEnum_1.SignalTypeEnum.PARTIAL_CLOSE
                    && side == BinanceEnum_1.PositionSideEnum.LONG) {
                    order = await this.placeFutureSellOrder(instance, symbol, side, type, quantity, price);
                    if (order?.code) {
                        order = await this.handleFutureOpenOrdersClose(instance, symbol, side, quantity);
                    }
                }
                else if (signalType == BinanceEnum_1.SignalTypeEnum.PARTIAL_CLOSE
                    && side == BinanceEnum_1.PositionSideEnum.SHORT) {
                    order = await this.placeFutureBuyOrder(instance, symbol, side, type, quantity, price);
                    if (order?.code) {
                        order = await this.handleFutureOpenOrdersClose(instance, symbol, side, quantity);
                    }
                }
                else {
                    throw new Error("Invalid Signal Type");
                }
                return this.createFutureOrderResponse(userId, order, orderDto, strategy, true, ratio);
            }
            catch (error) {
                return this.createFutureOrderResponse(userId, error, orderDto, strategy, false);
            }
        });
    }
    async handleFutureOpenOrdersClose(instance, symbol, side, quantity = 0) {
        try {
            symbol = symbol.toUpperCase();
            quantity = Number(quantity);
            let openOrders = await instance.futuresOpenOrders(symbol);
            if (openOrders?.code) {
                throw new Error(openOrders.message);
            }
            let orderIds = this.getOrdersToCancel(openOrders, quantity, side);
            let orders = openOrders.filter((order) => orderIds.includes(order.orderId));
            if (orderIds.length) {
                try {
                    let cancleOrderPromises = orderIds.map(orderId => instance.futuresCancel(symbol, { orderId: orderId }));
                    await Promise.all(cancleOrderPromises);
                    const remainingQuantity = quantity - this.calculateTotalQuantity(orders);
                    if (remainingQuantity > 0) {
                    }
                    return orders;
                }
                catch (error) {
                    throw new Error(error);
                }
            }
            else {
                return [];
            }
        }
        catch (err) {
            throw new Error("Something Went Wrong While removing Open Orders, Error: " + err.message);
        }
    }
    calculateTotalQuantity(orders) {
        return orders.reduce((total, order) => total + parseFloat(order?.origQty), 0);
    }
    getOrdersToCancel(orders, targetQty, targetSide) {
        targetSide = targetSide.toUpperCase();
        const filteredOrders = orders.filter((order) => {
            if (targetSide === 'LONG') {
                return order.side === 'BUY' && order.positionSide === 'LONG';
            }
            else if (targetSide === 'SHORT') {
                return order.side === 'SELL' && order.positionSide === 'SHORT';
            }
        });
        if (!filteredOrders.length) {
            return [];
        }
        filteredOrders.sort((a, b) => parseFloat(a?.origQty) - parseFloat(b?.origQty));
        let totalQty = 0;
        let ordersToCancel = [];
        for (const order of filteredOrders) {
            totalQty += parseFloat(order?.origQty);
            ordersToCancel.push(order?.orderId);
            if (totalQty >= targetQty) {
                break;
            }
        }
        return ordersToCancel;
    }
    async setLeverageAndMarginType(instance, symbol, leverage, isolated, userId) {
        try {
            let cacheKey = `${symbol}-leverage`;
            let storedLeverage = await this.cacheService.get(cacheKey);
            if (Number(storedLeverage) == Number(leverage)) {
                return true;
            }
            let [leverageResult, marginTypeRes] = [instance.futuresLeverage(symbol.toUpperCase(), Number(leverage)), instance.futuresMarginType(symbol.toUpperCase(), Boolean(isolated) ? 'ISOLATED' : "CROSSED")];
            if (leverageResult?.code || (marginTypeRes?.code && marginTypeRes.code !== -4046)) {
                throw new Error("Failed to set leverage or margin type Error : " + leverageResult?.msg + " & " + marginTypeRes?.msg);
            }
            await this.cacheService.set(cacheKey, leverage);
            return true;
        }
        catch (error) {
            console.error("Error setting leverage or margin type: ", error);
            throw new Error("Failed to set leverage or margin type");
        }
    }
    async placeOrder(instance, symbol, side, quantity, price) {
        try {
            return await instance.futuresBuy(symbol, quantity, price, null, {
                type: "MARKET",
                positionSide: side,
                timestamp: Date.now()
            });
        }
        catch (error) {
            console.error("Error placing order: ", error);
            throw new Error("Order placement failed");
        }
    }
    async placeFutureBuyOrder(instance, symbol, side, type, quantity, price) {
        symbol = symbol.toUpperCase();
        side = side.toUpperCase();
        type = type.toUpperCase();
        if (!Object.values(BinanceEnum_1.PositionTypeEnum).includes(type)) {
            throw new Error("Invalid order type");
        }
        if (!Object.values(BinanceEnum_1.PositionSideEnum).includes(side)) {
            throw new Error("Invalid order side");
        }
        price = BinanceEnum_1.PositionTypeEnum.MARKET === type ? null : price;
        try {
            return await instance.futuresBuy(symbol, quantity, price, {
                type: type,
                positionSide: side,
                timestamp: Date.now()
            });
        }
        catch (error) {
            console.error("Error placing order: ", error);
            throw new Error("Order placement failed");
        }
    }
    async placeFutureSellOrder(instance, symbol, side, type, quantity, price) {
        symbol = symbol.toUpperCase();
        side = side.toUpperCase();
        type = type.toUpperCase();
        if (!Object.values(BinanceEnum_1.PositionTypeEnum).includes(type)) {
            throw new Error("Invalid order type");
        }
        if (!Object.values(BinanceEnum_1.PositionSideEnum).includes(side)) {
            throw new Error("Invalid order side");
        }
        price = BinanceEnum_1.PositionTypeEnum.MARKET === type ? null : price;
        try {
            let result = await instance.futuresSell(symbol, quantity, price, {
                type: type,
                positionSide: side,
                timestamp: Date.now()
            });
            console.log(result);
            return result;
        }
        catch (error) {
            console.error("Error placing order: ", error);
            throw new Error("Order placement failed");
        }
    }
    createFutureOrderResponse(userId, data, orderDto, strategy, isSuccess, ratio = null) {
        if (!isSuccess) {
            return {
                userId,
                orderDto,
                strategy,
                success: false,
                message: data?.message || "Order failed"
            };
        }
        return {
            userId,
            orderDto,
            strategy,
            ratio,
            order: data,
            success: true
        };
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
                useServerTime: false,
                test: true,
                baseURL: "https://testnet.binancefuture.com",
            });
            binance.options({
                APIKEY: apiKey,
                APISECRET: secretKey,
                useServerTime: false
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
    __param(2, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [user_service_1.UserService,
        order_service_1.OrderService, Object])
], BinanceService);
//# sourceMappingURL=binance.service%20copy.js.map