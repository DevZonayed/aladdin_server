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
const mail_type_enum_1 = require("../../notification/mail/enum/mail.type.enum");
const notification_service_1 = require("../../notification/mail/service/notification.service");
const createdBy_enum_1 = require("../../order/enums/createdBy.enum");
const status_enum_1 = require("../../order/enums/status.enum");
const order_service_1 = require("../../order/service/order.service");
const strategy_service_1 = require("../../strategy/service/strategy.service");
const user_service_1 = require("../../user/service/user.service");
const BinanceEnum_1 = require("../enum/BinanceEnum");
const trade_calculations_1 = require("../utils/trade.calculations");
const exchangeInfo_service_1 = require("./exchangeInfo.service");
const Binance = require('node-binance-api');
let BinanceService = class BinanceService {
    constructor(userService, orderService, strategyService, notificationService, cacheService) {
        this.userService = userService;
        this.orderService = orderService;
        this.strategyService = strategyService;
        this.notificationService = notificationService;
        this.cacheService = cacheService;
        this.binanceExchaneService = new exchangeInfo_service_1.BinanceExchaneService(cacheService);
    }
    async checkBalance(apiKey, secretKey) {
        return await this.executeBinanceApiAction(apiKey, secretKey, async (binance, binanceTest) => {
            try {
                const originalApiPromise = this.safePromiseBuild(binance.futuresBalance(), 'Original API');
                const testnetApiPromise = this.safePromiseBuild(binanceTest.futuresBalance(), 'Testnet API');
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
    async safePromiseBuild(apiCall, identifier = "") {
        return apiCall.then(result => ({ result, identifier, success: true }), error => ({ error, identifier, success: false }));
    }
    ;
    async createStrategyOrders(strategy, userCredentials, OrderWebHookDto) {
        try {
            let credentials = userCredentials.map(user => ({ _id: user._id, apiKey: user?.binanceCredentials?.apiKey, apiSecret: user?.binanceCredentials?.apiSecret, isTestMode: user?.binanceCredentials?.isTestMode }));
            let finalCredentials = credentials.filter(credential => credential.apiKey && credential.apiSecret);
            if (finalCredentials.length == 0) {
                throw new Error("No valid credentials found");
            }
            let accauntOrderPromises = finalCredentials.map(async (credential) => {
                try {
                    let result = await this.generateFutureOrders(strategy, credential, OrderWebHookDto);
                    return {
                        result,
                        userId: credential._id
                    };
                }
                catch (err) {
                    return {
                        result: null,
                        userId: credential._id,
                        error: err.message
                    };
                }
            });
            let binanceOrderResult = await Promise.all(accauntOrderPromises);
            let saveResult = await this.persistOrderResults(binanceOrderResult, strategy, OrderWebHookDto, finalCredentials);
            return saveResult;
        }
        catch (err) {
            throw Error(err.message);
        }
    }
    async persistOrderResults(results, strategy, orderDto, finalCredentials) {
        let signalType = orderDto.signalType.toUpperCase();
        const orderSavePromises = results.map(result => this.handleOrderResultProcessing(result, strategy, orderDto));
        let persistOrderResults = await Promise.allSettled(orderSavePromises);
        let successResults = persistOrderResults.filter(result => result.status == "fulfilled");
        let failedResults = persistOrderResults.filter(result => result.status == "rejected");
        successResults.map((item, index) => {
            if (item.status == "fulfilled" && item.value?.payload?.msg) {
                let failPayload = {
                    status: "rejected",
                    reason: {
                        message: item.value.payload.msg
                    }
                };
                failedResults.push(failPayload);
                successResults.splice(index, 1);
            }
        });
        let mailMessage = `<p>We received a ${signalType} signal in "${strategy.StrategyName}" strategy with "${orderDto.symbol}" symbol. </p>`;
        if (successResults.length == finalCredentials.length) {
            mailMessage += "<p>All accounts subscribed to it were successfully executed 😍</p>\n";
        }
        else if (failedResults.length == finalCredentials.length) {
            mailMessage += "<p>Failed to execute the order for all subscribed accounts 😥</p>\n";
        }
        else if (successResults.length > 0 && finalCredentials.length > 0) {
            mailMessage += `<p>Successfully executed the order for ${successResults.length} subscribed accounts 😍\n and failed for ${failedResults.length} subscribed accounts 😥</p>`;
        }
        let failedReasonsArr = failedResults.map((item) => item.reason.message);
        let errorCount = failedReasonsArr.reduce((acc, curr) => {
            acc[curr] = (acc[curr] || 0) + 1;
            return acc;
        }, {});
        let formattedErrorMessages = Object.keys(errorCount).map(key => `In ${errorCount[key]} Accaunt(s): ${key}`).join('\n');
        mailMessage += `\n${formattedErrorMessages}`;
        this.notificationService.sendNotificationToAllAdmins({
            subject: "Alert Notification From Aladdin",
            message: mailMessage,
            type: mail_type_enum_1.MailNotificationTypeEnum.EXITING
        });
        return {
            successResults,
            failedResults,
            message: mailMessage
        };
    }
    async handleOrderResultProcessing(response, strategy, orderDto) {
        try {
            const existOrder = await this.orderService.findOpenOrder(strategy._id, orderDto.copyOrderId, response.userId, orderDto.symbol, orderDto.side);
            if (response?.result == null && orderDto.signalType == "CLOSE" && existOrder.status) {
                await this.forceCloseOrder(existOrder.data);
            }
            let result;
            if (response?.result == null) {
                throw new Error(response?.error?.message);
            }
            else if (response?.result !== null) {
                result = response.result;
            }
            else {
                throw new Error("Order Promise Status Unknown.");
            }
            const { userId, success, message, order, ratio, } = this.retrieveDataFromOrderResult(result);
            if (!success) {
                throw new Error(message);
            }
            if (existOrder.status) {
                return this.updateExistingOrder(existOrder, orderDto, order);
            }
            else {
                return this.buildNewOrderPayload(success, userId, strategy, orderDto, order, ratio, message);
            }
        }
        catch (err) {
            throw new Error(err.message);
        }
    }
    retrieveDataFromOrderResult(result) {
        return {
            userId: result.userId,
            orderDto: result.orderDto,
            success: result.success,
            message: result.message,
            order: result?.order,
            ratio: result?.ratio,
            strategy: result.strategy
        };
    }
    buildNewOrderPayload(success, userId, strategy, orderDto, order, ratio, message) {
        let payload = {
            userId,
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
        if (success) {
            payload = {
                ...payload,
                binanceOrderId: order.orderId,
                entryPrice: order.price,
                orderQty: order.origQty,
                initialOrderRatio: ratio
            };
        }
        else {
            payload = {
                ...payload,
                binanceOrderId: null,
                orderQty: null,
                status: status_enum_1.StatusEnum.CLOSED,
                closeReason: message
            };
        }
        return this.orderService.create(payload);
    }
    async updateExistingOrder(existOrder, orderDto, order) {
        try {
            const orderData = existOrder.data;
            const updatePayload = this.computeOrderUpdateDetails(orderData, orderDto, order);
            const updateResult = await this.orderService.update(orderData._id, updatePayload);
            if (updateResult.payload) {
                return { success: true, message: "Order Updated Successfully" };
            }
            else {
                throw new Error("Order Update To Database Failed!");
            }
        }
        catch (err) {
            throw new Error(err.message);
        }
    }
    computeOrderUpdateDetails(orderData, orderDto, order) {
        let updatePayload = {};
        if (orderDto.signalType === BinanceEnum_1.SignalTypeEnum.PARTIAL_CLOSE || orderDto.signalType === BinanceEnum_1.SignalTypeEnum.CLOSE) {
            let closedQuantity = orderData.closedQty + this.computeClosedOrderQuantity(order, orderDto);
            let totalOrderQuantity = orderData.orderQty;
            if (totalOrderQuantity <= closedQuantity) {
                updatePayload = {
                    closedQty: closedQuantity,
                    status: status_enum_1.StatusEnum.CLOSED,
                    closeReason: `${orderDto.signalType} Signals Quantity Sell Achived!`
                };
            }
            else {
                updatePayload = {
                    closedQty: closedQuantity
                };
            }
        }
        else {
            let totalOrderQuantity = orderData.orderQty + this.computeOrderTotalQuantity(order, orderDto);
            updatePayload = { orderQty: totalOrderQuantity };
        }
        return updatePayload;
    }
    async forceCloseOrder(order) {
        try {
            let payload = {
                status: status_enum_1.StatusEnum.CLOSED,
                closeReason: "From Binance the order i am unable to close so i have close it forcefully for order safety"
            };
            await this.orderService.update(order._id, payload);
        }
        catch (err) {
            throw new Error(err.message);
        }
    }
    computeClosedOrderQuantity(order, orderDto) {
        if (Array.isArray(order)) {
            return order.reduce((sum, item) => sum + Number(item?.origQty || 0), 0);
        }
        else if (order && order.origQty) {
            return Number(order.origQty);
        }
        else {
            return Number(orderDto.quantity);
        }
    }
    computeOrderTotalQuantity(order, orderDto) {
        if (order && order.origQty) {
            return Number(order.origQty);
        }
        else {
            return Number(orderDto.quantity);
        }
    }
    async generateFutureOrders(strategy, credentials, orderDto) {
        let { apiKey, apiSecret, isTestMode, _id: userId } = credentials;
        return await this.executeBinanceApiAction(apiKey, apiSecret, async (binance, binanceTest) => {
            try {
                let { symbol, side, type, quantity, price, leverage, signalType } = orderDto;
                if (!symbol || !side || !type || !quantity || !price || !signalType) {
                    throw new Error("Missing required parameters");
                }
                symbol = symbol.toUpperCase();
                side = side.toUpperCase();
                signalType = signalType.toUpperCase();
                type = type.toUpperCase();
                leverage = (strategy.tradeMaxLeverage || 10) <= +leverage ? (strategy.tradeMaxLeverage || 10) : leverage;
                let instance = isTestMode ? binanceTest : binance;
                let newOrderType = strategy.newOrderType || "MARKET";
                let partialOrderType = strategy.partialOrderType || "MARKET";
                let isolated = strategy?.isolated || false;
                let isMaxPositionIncludeOpen = Boolean(strategy?.maxPosition?.includeOpen) || false;
                if (!Object.values(BinanceEnum_1.SignalTypeEnum).includes(signalType)) {
                    throw new Error("Invalid Signal Type, Signal Type is " + signalType);
                }
                let binanceBalance = this.userService.getBinanceBalance(userId);
                let prevOrder = this.orderService.findOpenOrder(strategy._id, orderDto.copyOrderId, userId, orderDto.symbol, orderDto.side);
                let openPositionCountPromise = this.getBinanceAccountOrderCount(instance, isMaxPositionIncludeOpen);
                let [binanceBalanceRes, prevOrderRes, openPositionCount] = await Promise.all([this.safePromiseBuild(binanceBalance), this.safePromiseBuild(prevOrder), this.safePromiseBuild(openPositionCountPromise)]);
                if (!binanceBalanceRes.success || binanceBalanceRes?.result?.code) {
                    throw new Error("Binance Balance Fetch Failed " + binanceBalanceRes.error?.message || binanceBalanceRes?.result?.msg);
                }
                else {
                    binanceBalanceRes = binanceBalanceRes.result;
                }
                if (prevOrderRes.success) {
                    prevOrderRes = prevOrderRes?.result?.data;
                }
                else {
                    prevOrderRes = null;
                }
                if (openPositionCount.success) {
                    openPositionCount = openPositionCount.result;
                }
                else {
                    throw new Error("Open Position Count Fetch Failed " + openPositionCount.error?.message || openPositionCount?.result?.msg);
                }
                this.handleOrderBounced(prevOrderRes, signalType, strategy, side, openPositionCount);
                if (prevOrderRes) {
                    if (signalType === BinanceEnum_1.SignalTypeEnum.NEW) {
                        await this.updateOrderForNewSignal(prevOrderRes);
                    }
                    else if (signalType === BinanceEnum_1.SignalTypeEnum.RE_ENTRY) {
                        await this.updateOrderForReEntrySignal(prevOrderRes, strategy);
                    }
                }
                else {
                    this.handleNoPreviousOrder(prevOrderRes, signalType, strategy);
                }
                let rootTradeAmount = Number(price) * Number(quantity);
                let rootTradeCapital = Number(strategy.capital);
                let myCapital = Number(binanceBalanceRes?.balance);
                let maxTradeAmount = (0, trade_calculations_1.calculateAmountFromPercentage)(myCapital, Number(strategy.tradeMaxAmountPercentage));
                let orderRatio = prevOrderRes?.initialOrderRatio ? Number(prevOrderRes.initialOrderRatio) : null;
                let { tradeAmount: accauntTradeAmount, ratio } = (0, trade_calculations_1.calculateMyTradeAmount)(rootTradeAmount, rootTradeCapital, myCapital, maxTradeAmount, orderRatio);
                quantity = (0, trade_calculations_1.calculateQuantity)(accauntTradeAmount, price);
                if (signalType == BinanceEnum_1.SignalTypeEnum.CLOSE) {
                    signalType = BinanceEnum_1.SignalTypeEnum.PARTIAL_CLOSE;
                    if (prevOrderRes?.orderQty) {
                        let orderQty = Number(prevOrderRes?.orderQty);
                        let closedQty = Number(prevOrderRes?.closedQty) || 0;
                        quantity = (orderQty - closedQty + 0.01);
                    }
                }
                let respectNotion = strategy?.respectNotion || false;
                quantity = await this.binanceExchaneService.formatQuantity(symbol, quantity, respectNotion);
                price = await this.binanceExchaneService.formatPrice(symbol, price);
                await this.configureLeverageAndMarginSettings(instance, symbol, leverage, isolated, userId);
                let order = "";
                if ((signalType == BinanceEnum_1.SignalTypeEnum.NEW || signalType == BinanceEnum_1.SignalTypeEnum.RE_ENTRY)
                    && side == BinanceEnum_1.PositionSideEnum.LONG) {
                    let type = signalType == BinanceEnum_1.SignalTypeEnum.RE_ENTRY ? partialOrderType : newOrderType;
                    order = await this.executeFutureBuyOrder(instance, symbol, side, type, quantity, price);
                    if (order?.code) {
                        throw Error(order.msg);
                    }
                }
                else if ((signalType == BinanceEnum_1.SignalTypeEnum.NEW || signalType == BinanceEnum_1.SignalTypeEnum.RE_ENTRY)
                    && side == BinanceEnum_1.PositionSideEnum.SHORT) {
                    let type = signalType == BinanceEnum_1.SignalTypeEnum.RE_ENTRY ? partialOrderType : newOrderType;
                    order = await this.executeFutureSellOrder(instance, symbol, side, type, quantity, price);
                    if (order?.code) {
                        throw Error(order.msg);
                    }
                }
                else if (signalType == BinanceEnum_1.SignalTypeEnum.PARTIAL_CLOSE
                    && side == BinanceEnum_1.PositionSideEnum.LONG) {
                    order = await this.executeFutureSellOrder(instance, symbol, side, type, quantity, price);
                    if (order?.code) {
                        let openOrderClosedRes = await this.processClosingOfOpenFutureOrders(instance, symbol, side, quantity);
                        if (openOrderClosedRes.length == 0) {
                            throw new Error("Partial Close Failed " + order.msg);
                        }
                        else {
                            order = openOrderClosedRes;
                        }
                    }
                }
                else if (signalType == BinanceEnum_1.SignalTypeEnum.PARTIAL_CLOSE
                    && side == BinanceEnum_1.PositionSideEnum.SHORT) {
                    order = await this.executeFutureBuyOrder(instance, symbol, side, type, quantity, price);
                    if (order?.code) {
                        let openOrderClosedRes = await this.processClosingOfOpenFutureOrders(instance, symbol, side, quantity);
                        if (openOrderClosedRes.length == 0) {
                            throw new Error("Partial Close Failed " + order.msg);
                        }
                        else {
                            order = openOrderClosedRes;
                        }
                    }
                }
                else {
                    throw new Error("Invalid Signal Type or order side, Sended Signal Type: " + signalType + " Order Side: " + side);
                    ;
                }
                return this.generateFutureOrdersResponse(userId, order, orderDto, strategy, true, ratio);
            }
            catch (error) {
                return this.generateFutureOrdersResponse(userId, error, orderDto, strategy, false);
            }
        });
    }
    async processClosingOfOpenFutureOrders(instance, symbol, side, quantity = 0) {
        try {
            symbol = symbol.toUpperCase();
            quantity = Number(quantity);
            let openOrders = await instance.futuresOpenOrders(symbol);
            if (openOrders?.code) {
                throw new Error(openOrders.message);
            }
            let orderIds = this.identifyOrdersForCancellation(openOrders, quantity, side);
            let orders = openOrders.filter((order) => orderIds.includes(order.orderId));
            if (orderIds.length) {
                try {
                    let cancleOrderPromises = orderIds.map(orderId => instance.futuresCancel(symbol, { orderId: orderId }));
                    await Promise.all(cancleOrderPromises);
                    const remainingQuantity = quantity - this.computeTotalOrderQuantity(orders);
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
    computeTotalOrderQuantity(orders) {
        return orders.reduce((total, order) => total + parseFloat(order?.origQty), 0);
    }
    identifyOrdersForCancellation(orders, targetQty, targetSide) {
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
    async configureLeverageAndMarginSettings(instance, symbol, leverage, isolated, userId) {
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
    async executeFutureBuyOrder(instance, symbol, side, type, quantity, price) {
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
            let result = await instance.futuresBuy(symbol, quantity, price, {
                type: type,
                positionSide: side,
                timestamp: Date.now()
            });
            return result;
        }
        catch (error) {
            console.log(error);
            throw new Error("Order placement failed Error: " + error.message);
        }
    }
    async executeFutureSellOrder(instance, symbol, side, type, quantity, price) {
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
            return result;
        }
        catch (error) {
            throw new Error("Order placement failed Error : " + error.message);
        }
    }
    generateFutureOrdersResponse(userId, data, orderDto, strategy, isSuccess, ratio = null) {
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
    async getBinanceRiskPositionCount(binance) {
        try {
            let positions = await binance.futuresPositionRisk();
            const openPositions = positions.filter(position => parseFloat(position.positionAmt) !== 0);
            return openPositions.length || 0;
        }
        catch (err) {
            throw err;
        }
    }
    async getBinanceOpenOrderCount(binance) {
        try {
            let openOrders = await binance.futuresOpenOrders();
            return openOrders.length || 0;
        }
        catch (err) {
            throw err;
        }
    }
    async getBinanceAccountOrderCount(binance, includeOpen = false) {
        try {
            let orderCount = 0;
            let countPromises = [];
            countPromises.push(this.getBinanceRiskPositionCount(binance));
            if (includeOpen) {
                countPromises.push(this.getBinanceOpenOrderCount(binance));
            }
            let startTime = Date.now();
            let results = await Promise.all(countPromises) || [];
            orderCount = results.reduce((a, b) => a + b, 0) || 0;
            console.log(`Total Time For Fatching open order count: ${Date.now() - startTime}`);
            return orderCount;
        }
        catch (err) {
            throw err;
        }
    }
    async executeBinanceApiAction(apiKey, secretKey, action) {
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
    async updateOrderForNewSignal(prevOrderRes) {
        await this.orderService.update(prevOrderRes._id, { status: status_enum_1.StatusEnum.CLOSED, closeReason: "New Signal found" });
        prevOrderRes = null;
    }
    async updateOrderForReEntrySignal(prevOrderRes, strategy) {
        await this.orderService.update(prevOrderRes._id, { $inc: { reEntryCount: 1 } });
        if (+prevOrderRes.reEntryCount >= (+strategy.maxReEntry || 4)) {
            await this.strategyService.update(strategy._id, { stopNewOrder: true });
            throw new Error(`Max Re-Entry Count reached for ${strategy.StrategyName}`);
        }
    }
    handleNoPreviousOrder(prevOrderRes, signalType, strategy) {
        if ((signalType === BinanceEnum_1.SignalTypeEnum.NEW || signalType === BinanceEnum_1.SignalTypeEnum.RE_ENTRY) && strategy.stopNewOrder) {
            throw new Error(`New ${signalType} found in ${strategy.StrategyName} this strategy But new order is stopped`);
        }
    }
    handleOrderBounced(prevOrderRes, signalType, strategy, side, openPositionCount) {
        let maxPositionLimit = Number(strategy?.maxPosition?.max) || 10;
        if (prevOrderRes && prevOrderRes.reEntryCount >= strategy.maxReEntry) {
            throw new Error(`Signal Ignored for "${strategy.StrategyName}" strategy, because max re-entry count reached of this order.`);
        }
        if (signalType === BinanceEnum_1.SignalTypeEnum.NEW && strategy.stopNewOrder) {
            throw new Error(`We have found ${signalType} signal in ${strategy.StrategyName} this strategy, but new orders are currently disabled.`);
        }
        if (!prevOrderRes && signalType === BinanceEnum_1.SignalTypeEnum.RE_ENTRY) {
            throw new Error(`We have found ${signalType} signal in ${strategy.StrategyName} this strategy, but new orders are currently disabled.`);
        }
        if (!prevOrderRes && (signalType === BinanceEnum_1.SignalTypeEnum.CLOSE || signalType === BinanceEnum_1.SignalTypeEnum.PARTIAL_CLOSE)) {
            throw new Error(`We have found ${signalType} signal in ${strategy.StrategyName} this strategy, but there is no open order to close on this strategy.`);
        }
        if (maxPositionLimit <= openPositionCount && signalType == BinanceEnum_1.SignalTypeEnum.NEW) {
            throw new Error(`Max Position Limit Exceeded, Max Position Limit is ${maxPositionLimit} For this strategy : ${strategy?.StrategyName}`);
        }
        let prefaredSignalType = strategy?.prefaredSignalType || "BOTH";
        if (prefaredSignalType == "BOTH") {
            return;
        }
        if (prefaredSignalType !== side) {
            throw new Error(`We have found "${signalType}" signal in "${strategy.StrategyName}" this strategy in "${side}" this side, but this strategy Position prefarence is "${prefaredSignalType}".`);
        }
        return;
    }
};
exports.BinanceService = BinanceService;
exports.BinanceService = BinanceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => user_service_1.UserService))),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => order_service_1.OrderService))),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => strategy_service_1.StrategyService))),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => notification_service_1.NotificationService))),
    __param(4, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [user_service_1.UserService,
        order_service_1.OrderService,
        strategy_service_1.StrategyService,
        notification_service_1.NotificationService, Object])
], BinanceService);
//# sourceMappingURL=binance.service.js.map