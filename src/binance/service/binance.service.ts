import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { Cache } from 'cache-manager';
import BinanceType from "node-binance-api";
import { INVALID_BINANCE_CREDENTIALS } from 'src/common/constants';
import { MailNotificationTypeEnum } from 'src/notification/mail/enum/mail.type.enum';
import { NotificationService } from 'src/notification/mail/service/notification.service';
import { CreatedByEnum } from 'src/order/enums/createdBy.enum';
import { StatusEnum } from 'src/order/enums/status.enum';
import { OrderService } from 'src/order/service/order.service';
import { OrderWebHookDto } from 'src/strategy/dto/order_webhook-dto';
import { Strategy } from 'src/strategy/entities/strategy.entity';
import { StrategyService } from 'src/strategy/service/strategy.service';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/service/user.service';
import { PositionSideEnum, PositionTypeEnum, SignalTypeEnum } from '../enum/BinanceEnum';
import { calculateAmountFromPercentage, calculateMyTradeAmount, calculateQuantity } from '../utils/trade.calculations';
import { BinanceExchaneService } from './exchangeInfo.service';
const Binance = require('node-binance-api');


@Injectable()
export class BinanceService {
    binanceExchaneService: BinanceExchaneService;
    constructor(
        @Inject(forwardRef(() => UserService)) private readonly userService: UserService,
        @Inject(forwardRef(() => OrderService)) private readonly orderService: OrderService,
        @Inject(forwardRef(() => StrategyService)) private readonly strategyService: StrategyService,
        @Inject(forwardRef(() => NotificationService)) private readonly notificationService: NotificationService,
        @Inject(CACHE_MANAGER) private cacheService: Cache,

    ) {
        this.binanceExchaneService = new BinanceExchaneService(cacheService)
    }

    async checkBalance(apiKey: string, secretKey: string) {
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
                    } else {
                        throw new Error("Invalid API response: " + result.msg);
                    }
                } else {
                    let errorMessage = "\n"
                    results.map(item => {
                        errorMessage += item?.error?.message || item.result.msg + "\n";
                    })
                    throw new Error("Error Occured in balance checking: " + errorMessage);
                }

            } catch (err) {
                throw new Error(err.message);
            }
        });
    }

    private async safePromiseBuild(apiCall, identifier = "") {
        return apiCall.then(
            result => ({ result, identifier, success: true }),
            error => ({ error, identifier, success: false })
        );
    };

    async createStrategyOrders(strategy: Strategy, userCredentials: User[], OrderWebHookDto: OrderWebHookDto) {
        try {
            let credentials = userCredentials.map(user => ({ _id: user._id, apiKey: user?.binanceCredentials?.apiKey, apiSecret: user?.binanceCredentials?.apiSecret, isTestMode: user?.binanceCredentials?.isTestMode }));

            let finalCredentials = credentials.filter(credential => credential.apiKey && credential.apiSecret);

            if (finalCredentials.length == 0) {
                throw new Error("No valid credentials found");
            }

            let accauntOrderPromises = finalCredentials.map(async (credential) => {
                return await this.generateFutureOrders(strategy, credential, OrderWebHookDto);
            });

            let binanceOrderResult = await Promise.allSettled(accauntOrderPromises);

            let saveResult = await this.persistOrderResults(binanceOrderResult, strategy, OrderWebHookDto, finalCredentials);


            return saveResult;

        } catch (err) {
            throw Error(err.message)
        }
    }

    private async persistOrderResults(results: any, strategy: Strategy, orderDto: OrderWebHookDto, finalCredentials: any[]) {
        let signalType = orderDto.signalType.toUpperCase();

        const orderSavePromises = results.map(result => this.handleOrderResultProcessing(result));
        let persistOrderResults = await Promise.allSettled(orderSavePromises);
        let successResults: any = persistOrderResults.filter(result => result.status == "fulfilled");
        let failedResults = persistOrderResults.filter(result => result.status == "rejected");
        // console.log(failedResults)
        successResults.map((item, index) => {
            // Check if binance error is there
            if (item.status == "fulfilled" && item.value?.payload?.msg) {
                let failPayload = {
                    status: "rejected",
                    reason: {
                        message: item.value.payload.msg
                    }
                }
                failedResults.push(failPayload as PromiseSettledResult<any>);
                successResults.splice(index, 1);
            }
        })


        let mailMessage = `<p>We received a ${signalType} signal in "${strategy.StrategyName}" strategy with "${orderDto.symbol}" symbol. </p>`;

        if (successResults.length == finalCredentials.length) {
            mailMessage += "<p>All accounts subscribed to it were successfully executed 😍</p>\n";
        } else if (failedResults.length == finalCredentials.length) {
            mailMessage += "<p>Failed to execute the order for all subscribed accounts 😥</p>\n";
        } else if (successResults.length > 0 && finalCredentials.length > 0) {
            mailMessage += `<p>Successfully executed the order for ${successResults.length} subscribed accounts 😍\n and failed for ${failedResults.length} subscribed accounts 😥</p>`;
        }

        let failedReasonsArr = failedResults.map((item: any) => item.reason.message);
        let errorCount = failedReasonsArr.reduce((acc, curr) => {
            acc[curr] = (acc[curr] || 0) + 1;
            return acc;
        }, {});

        let formattedErrorMessages = Object.keys(errorCount).map(key => `In ${errorCount[key]} Accaunt(s): ${key}`).join('\n');
        mailMessage += `\n${formattedErrorMessages}`;

        this.notificationService.sendNotificationToAllAdmins({
            subject: "Alert Notification From Aladdin",
            message: mailMessage,
            type: MailNotificationTypeEnum.EXITING
        })

        return {
            successResults,
            failedResults,
            message: mailMessage
        };

    }

    private async handleOrderResultProcessing(result: any) {
        try {

            if (result.status == "rejected") {
                throw new Error(result.reason.message)
            } else if (result.status == "fulfilled") {
                result = result.value;
            } else {
                throw new Error("Order Promise Status Unknown.")
            }

            const {
                userId,
                orderDto,
                success,
                message,
                order,
                ratio,
                strategy
            } = this.retrieveDataFromOrderResult(result);

            if (!success) {
                throw new Error(message);
            }
            const existOrder = await this.orderService.findOpenOrder(strategy._id, orderDto.copyOrderId, userId, orderDto.symbol, orderDto.side);

            if (existOrder.status) {
                return this.updateExistingOrder(existOrder, orderDto, order);
            } else {
                return this.buildNewOrderPayload(success, userId, strategy, orderDto, order, ratio, message);
            }
        } catch (err) {
            throw new Error(err.message);
        }
    }

    private retrieveDataFromOrderResult(result: any) {
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


    private buildNewOrderPayload(success, userId, strategy, orderDto, order, ratio, message) {
        let payload: any = {
            userId,
            strategyId: strategy._id,
            copyOrderId: orderDto.copyOrderId,
            binanceOrderId: order.orderId,
            createdBy: CreatedByEnum.STRATEGY,
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
        } else {
            payload = {
                ...payload,
                binanceOrderId: null,
                orderQty: null,
                status: StatusEnum.CLOSED,
                closeReason: message
            };
        }

        return this.orderService.create(payload);
    }
    private async updateExistingOrder(existOrder, orderDto, order) {
        try {
            const orderData = existOrder.data;
            const updatePayload = this.computeOrderUpdateDetails(orderData, orderDto, order);

            const updateResult = await this.orderService.update(orderData._id, updatePayload);
            if (updateResult.payload) {
                return { success: true, message: "Order Updated Successfully" };
            } else {
                throw new Error("Order Update To Database Failed!");
            }

        } catch (err) {
            throw new Error(err.message);
        }
    }

    private computeOrderUpdateDetails(orderData, orderDto, order) {
        let updatePayload = {};

        if (orderDto.signalType === SignalTypeEnum.PARTIAL_CLOSE || orderDto.signalType === SignalTypeEnum.CLOSE) {
            let closedQuantity = orderData.closedQty + this.computeClosedOrderQuantity(order, orderDto);
            let totalOrderQuantity = orderData.orderQty;

            if (totalOrderQuantity <= closedQuantity) {
                updatePayload = {
                    closedQty: closedQuantity,
                    status: StatusEnum.CLOSED,
                    closeReason: `${orderDto.signalType} Signals Quantity Sell Achived!`
                };
            } else {
                updatePayload = {
                    closedQty: closedQuantity
                };
            }
        } else {
            let totalOrderQuantity = orderData.orderQty + this.computeOrderTotalQuantity(order, orderDto);
            updatePayload = { orderQty: totalOrderQuantity };
        }

        return updatePayload;
    }

    private computeClosedOrderQuantity(order, orderDto) {
        if (Array.isArray(order)) {
            return order.reduce((sum, item) => sum + Number(item?.origQty || 0), 0);
        } else if (order && order.origQty) {
            return Number(order.origQty);
        } else {
            return Number(orderDto.quantity);
        }
    }

    private computeOrderTotalQuantity(order, orderDto) {
        if (order && order.origQty) {
            return Number(order.origQty);
        } else {
            return Number(orderDto.quantity);
        }
    }

    // Create Order
    private async generateFutureOrders(strategy: Strategy, credentials: any, orderDto: OrderWebHookDto) {
        let { apiKey, apiSecret, isTestMode, _id: userId } = credentials;
        return await this.executeBinanceApiAction(apiKey, apiSecret, async (binance, binanceTest) => {
            try {
                // Parameter Validation
                let { symbol, side, type, quantity, price, leverage, signalType } = orderDto;

                if (!symbol || !side || !type || !quantity || !price || !signalType) {
                    throw new Error("Missing required parameters");
                }

                symbol = symbol.toUpperCase();
                side = side.toUpperCase();
                signalType = signalType.toUpperCase();
                type = type.toUpperCase();
                let newOrderType = strategy.newOrderType || "MARKET";
                let partialOrderType = strategy.partialOrderType || "MARKET";
                let isolated = strategy?.isolated || false;


                if (!Object.values(SignalTypeEnum).includes(signalType as any)) {
                    throw new Error("Invalid Signal Type, Signal Type is " + signalType);
                }


                // Account Balance and Instance Setup
                let binanceBalance = this.userService.getBinanceBalance(userId);
                let prevOrder = this.orderService.findOpenOrder(strategy._id, orderDto.copyOrderId, userId, orderDto.symbol, orderDto.side);


                let [binanceBalanceRes, prevOrderRes] = await Promise.all([this.safePromiseBuild(binanceBalance), this.safePromiseBuild(prevOrder)]);;

                if (!binanceBalanceRes.success || binanceBalanceRes?.result?.code) {
                    throw new Error("Binance Balance Fetch Failed " + binanceBalanceRes.error?.message || binanceBalanceRes?.result?.msg);
                } else {
                    binanceBalanceRes = binanceBalanceRes.result;
                }

                if (prevOrderRes.success) {
                    prevOrderRes = prevOrderRes?.result?.data;
                } else {
                    prevOrderRes = null;
                }


                // Manage Order Bounced
                this.handleOrderBounced(prevOrderRes, (signalType as SignalTypeEnum), strategy);

                // If New then update the previous order
                if (prevOrderRes) {
                    if (signalType === SignalTypeEnum.NEW) {
                        await this.updateOrderForNewSignal(prevOrderRes);
                    } else if (signalType === SignalTypeEnum.RE_ENTRY) {
                        await this.updateOrderForReEntrySignal(prevOrderRes, strategy);
                    }
                } else {
                    this.handleNoPreviousOrder(prevOrderRes, signalType as SignalTypeEnum, strategy);
                }



                let instance = isTestMode ? binanceTest : binance;

                // check max order limit
                let maxPositionLimit = Number(strategy?.maxPosition?.max) || 10;
                let isMaxPositionIncludeOpen = Boolean(strategy?.maxPosition?.includeOpen) || false;

                let openPositionCount = await this.getBinanceAccountOrderCount(instance, isMaxPositionIncludeOpen);
                if (maxPositionLimit <= openPositionCount) {
                    throw new Error(`Max Position Limit Exceeded, Max Position Limit is ${maxPositionLimit} For this strategy : ${strategy?.StrategyName}`)
                }

                // Calculate Trade Details
                let rootTradeAmount = Number(price) * Number(quantity);
                let rootTradeCapital = Number(strategy.capital);
                let myCapital = Number(binanceBalanceRes?.balance);
                let maxTradeAmount = calculateAmountFromPercentage(myCapital, Number(strategy.tradeMaxAmountPercentage));
                let orderRatio = prevOrderRes?.initialOrderRatio ? Number(prevOrderRes.initialOrderRatio) : null
                let { tradeAmount: accauntTradeAmount, ratio } = calculateMyTradeAmount(rootTradeAmount, rootTradeCapital, myCapital, maxTradeAmount, orderRatio);

                // Manage Quantity and Price and leverage
                quantity = calculateQuantity(accauntTradeAmount, price)

                // Close quantity handle
                if (signalType == SignalTypeEnum.CLOSE) {
                    signalType = SignalTypeEnum.PARTIAL_CLOSE;
                    if (prevOrderRes?.orderQty) {
                        let orderQty = Number(prevOrderRes?.orderQty);
                        let closedQty = Number(prevOrderRes?.closedQty) || 0;
                        quantity = (orderQty - closedQty + 0.01);
                    }
                }

                let respectNotion = strategy?.respectNotion || false;
                quantity = await this.binanceExchaneService.formatQuantity(symbol, quantity, respectNotion)

                price = await this.binanceExchaneService.formatPrice(symbol, price)
                await this.configureLeverageAndMarginSettings(instance, symbol, leverage, isolated, userId);

                let order: any = ""
                // Place Order
                if (
                    (signalType == SignalTypeEnum.NEW || signalType == SignalTypeEnum.RE_ENTRY)
                    && side == PositionSideEnum.LONG
                ) {
                    let type = signalType == SignalTypeEnum.RE_ENTRY ? partialOrderType : newOrderType;
                    order = await this.executeFutureBuyOrder(instance, symbol, side, type, quantity, price);
                    if (order?.code) {
                        throw Error(order.msg)
                    }
                } else if (
                    (signalType == SignalTypeEnum.NEW || signalType == SignalTypeEnum.RE_ENTRY)
                    && side == PositionSideEnum.SHORT
                ) {
                    let type = signalType == SignalTypeEnum.RE_ENTRY ? partialOrderType : newOrderType;
                    order = await this.executeFutureSellOrder(instance, symbol, side, type, quantity, price);
                    if (order?.code) {
                        throw Error(order.msg)
                    }
                } else if (
                    signalType == SignalTypeEnum.PARTIAL_CLOSE
                    && side == PositionSideEnum.LONG
                ) {
                    order = await this.executeFutureSellOrder(instance, symbol, side, type, quantity, price);
                    if (order?.code) {
                        let openOrderClosedRes = await this.processClosingOfOpenFutureOrders(instance, symbol, side, quantity);
                        if (openOrderClosedRes.length == 0) {
                            throw new Error("Partial Close Failed " + order.msg);
                        } else {
                            order = openOrderClosedRes;
                        }

                    }
                } else if (
                    signalType == SignalTypeEnum.PARTIAL_CLOSE
                    && side == PositionSideEnum.SHORT
                ) {
                    order = await this.executeFutureBuyOrder(instance, symbol, side, type, quantity, price);
                    if (order?.code) {
                        let openOrderClosedRes = await this.processClosingOfOpenFutureOrders(instance, symbol, side, quantity);
                        if (openOrderClosedRes.length == 0) {
                            throw new Error("Partial Close Failed " + order.msg);
                        } else {
                            order = openOrderClosedRes;
                        }
                    }

                } else {
                    throw new Error("Invalid Signal Type or order side, Sended Signal Type: " + signalType + " Order Side: " + side);;
                }

                return this.generateFutureOrdersResponse(userId, order, orderDto, strategy, true, ratio);

            } catch (error) {
                return this.generateFutureOrdersResponse(userId, error, orderDto, strategy, false);
            }
        });
    }

    private async processClosingOfOpenFutureOrders(instance: BinanceType, symbol: string, side: string, quantity: number = 0) {
        try {
            symbol = symbol.toUpperCase();
            quantity = Number(quantity);

            let openOrders = await instance.futuresOpenOrders(symbol);
            if (openOrders?.code) {
                throw new Error(openOrders.message)
            }
            let orderIds = this.identifyOrdersForCancellation(openOrders, quantity, side)
            let orders = openOrders.filter((order: any) => orderIds.includes(order.orderId))

            if (orderIds.length) {
                try {
                    let cancleOrderPromises = orderIds.map(orderId => instance.futuresCancel(symbol, { orderId: orderId }));
                    await Promise.all(cancleOrderPromises);

                    // Calculate the remaining quantity and place a new order
                    const remainingQuantity = quantity - this.computeTotalOrderQuantity(orders);
                    if (remainingQuantity > 0) {
                        // Place new order logic here
                    }

                    return orders;
                } catch (error) {
                    throw new Error(error)
                }
            } else {
                return [];
            }
        } catch (err) {
            throw new Error("Something Went Wrong While removing Open Orders, Error: " + err.message)
        }
    }

    private computeTotalOrderQuantity(orders) {
        return orders.reduce((total, order) => total + parseFloat(order?.origQty), 0);
    }


    private identifyOrdersForCancellation(orders: any, targetQty: number, targetSide: String) {

        targetSide = targetSide.toUpperCase();
        const filteredOrders = orders.filter((order: any) => {
            if (targetSide === 'LONG') {
                return order.side === 'BUY' && order.positionSide === 'LONG';
            } else if (targetSide === 'SHORT') {
                return order.side === 'SELL' && order.positionSide === 'SHORT';
            }
        });

        if (!filteredOrders.length) {
            return [];
        }

        filteredOrders.sort((a: any, b: any) => parseFloat(a?.origQty) - parseFloat(b?.origQty));

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

    private async configureLeverageAndMarginSettings(instance, symbol, leverage, isolated, userId) {
        try {
            let cacheKey = `${symbol}-leverage`;

            let storedLeverage = await this.cacheService.get(cacheKey);
            if (Number(storedLeverage) == Number(leverage)) {
                return true;
            }

            let [leverageResult, marginTypeRes] = [instance.futuresLeverage(symbol.toUpperCase(), Number(leverage)), instance.futuresMarginType(symbol.toUpperCase(), Boolean(isolated) ? 'ISOLATED' : "CROSSED")]

            if (leverageResult?.code || (marginTypeRes?.code && marginTypeRes.code !== -4046)) {
                throw new Error("Failed to set leverage or margin type Error : " + leverageResult?.msg + " & " + marginTypeRes?.msg);
            }

            await this.cacheService.set(cacheKey, leverage);
            return true;
        } catch (error) {
            console.error("Error setting leverage or margin type: ", error);
            throw new Error("Failed to set leverage or margin type");
        }
    }

    private async executeFutureBuyOrder(instance: BinanceType, symbol: String, side: string, type: string, quantity: number, price: number) {
        symbol = symbol.toUpperCase();
        side = side.toUpperCase();
        type = type.toUpperCase();

        if (!Object.values(PositionTypeEnum).includes(type as PositionTypeEnum)) {
            throw new Error("Invalid order type")
        }

        if (!Object.values(PositionSideEnum).includes(side as PositionSideEnum)) {
            throw new Error("Invalid order side")
        }

        price = PositionTypeEnum.MARKET === type ? null : price;

        try {
            let result = await instance.futuresBuy(
                symbol,
                quantity,
                price,
                {
                    type: type,
                    positionSide: side,
                    timestamp: Date.now()
                });
            return result

        } catch (error) {
            console.log(error)
            throw new Error("Order placement failed Error: " + error.message);
        }
    }


    private async executeFutureSellOrder(instance: BinanceType, symbol: String, side: string, type: string, quantity: number, price: number) {
        symbol = symbol.toUpperCase();
        side = side.toUpperCase();
        type = type.toUpperCase();

        if (!Object.values(PositionTypeEnum).includes(type as PositionTypeEnum)) {
            throw new Error("Invalid order type")
        }

        if (!Object.values(PositionSideEnum).includes(side as PositionSideEnum)) {
            throw new Error("Invalid order side")
        }

        price = PositionTypeEnum.MARKET === type ? null : price;

        try {
            let result = await instance.futuresSell(
                symbol,
                quantity,
                price,
                {
                    type: type,
                    positionSide: side,
                    timestamp: Date.now()
                });

            return result


        } catch (error) {
            throw new Error("Order placement failed Error : " + error.message);
        }
    }


    private generateFutureOrdersResponse(userId, data, orderDto, strategy, isSuccess, ratio = null) {
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


    private async getBinanceRiskPositionCount(binance: BinanceType) {
        try {
            let positions = await binance.futuresPositionRisk();
            const openPositions = positions.filter(position => parseFloat(position.positionAmt) !== 0);
            return openPositions.length || 0;
        } catch (err) {
            throw err;
        }
    }

    private async getBinanceOpenOrderCount(binance: BinanceType) {
        try {
            let openOrders = await binance.futuresOpenOrders();
            return openOrders.length || 0;
        } catch (err) {
            throw err;
        }
    }

    private async getBinanceAccountOrderCount(binance: BinanceType, includeOpen: boolean = false) {
        try {
            let orderCount: number = 0;
            let countPromises = [];
            countPromises.push(this.getBinanceRiskPositionCount(binance));

            if (includeOpen) {
                countPromises.push(this.getBinanceOpenOrderCount(binance));
            }
            let results = await Promise.all(countPromises) || [];
            console.log(results)
            orderCount = results.reduce((a, b) => a + b, 0) || 0;
            return orderCount;
        } catch (err) {
            throw err;
        }
    }

    private async executeBinanceApiAction(apiKey: string, secretKey: string, action: (binance: BinanceType, binanceTest: BinanceType) => Promise<any>) {

        if (!apiKey || !secretKey) {
            throw new Error(INVALID_BINANCE_CREDENTIALS);
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
        } catch (err) {
            throw err;
        } finally {
            binance = null;
            binanceTest = null;
        }
    }

    // Helper functions
    private async updateOrderForNewSignal(prevOrderRes: any) {
        await this.orderService.update(prevOrderRes._id, { status: StatusEnum.CLOSED, closeReason: "New Signal found" });
        prevOrderRes = null;
    }

    private async updateOrderForReEntrySignal(prevOrderRes: any, strategy: Strategy) {
        await this.orderService.update(prevOrderRes._id, { $inc: { reEntryCount: 1 } });
        if (+prevOrderRes.reEntryCount >= (+strategy.maxReEntry || 4)) {
            await this.strategyService.update(strategy._id, { stopNewOrder: true });
            throw new Error(`Max Re-Entry Count reached for ${strategy.StrategyName}`);
        }
    }

    private handleNoPreviousOrder(prevOrderRes: any, signalType: SignalTypeEnum, strategy: Strategy) {
        if ((signalType === SignalTypeEnum.NEW || signalType === SignalTypeEnum.RE_ENTRY) && strategy.stopNewOrder) {
            throw new Error(`New ${signalType} found in ${strategy.StrategyName} this strategy But new order is stopped`);
        }
    }

    private handleOrderBounced(prevOrderRes: any, signalType: SignalTypeEnum, strategy: Strategy) {
        if (signalType === SignalTypeEnum.NEW && strategy.stopNewOrder) {
            throw new Error(`We have found ${signalType} signal in ${strategy.StrategyName} this strategy, but new orders are currently disabled.`);
        }
        if (!prevOrderRes && signalType === SignalTypeEnum.RE_ENTRY) {
            throw new Error(`We have found ${signalType} signal in ${strategy.StrategyName} this strategy, but new orders are currently disabled.`);
        }
        return;
    }
}
