import { Inject, Injectable, forwardRef } from '@nestjs/common';
import BinanceType from "node-binance-api";
import { INVALID_BINANCE_CREDENTIALS } from 'src/common/constants';
import { OrderService } from 'src/order/service/order.service';
import { OrderWebHookDto } from 'src/strategy/dto/order_webhook-dto';
import { Strategy } from 'src/strategy/entities/strategy.entity';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/service/user.service';
import { calculateParentTradePercentage, calculateQuantity, calculateTradeDetailsForUser } from '../utils/trade.calculations';
const Binance = require('node-binance-api');


@Injectable()
export class BinanceService {
    constructor(
        @Inject(forwardRef(() => UserService)) private readonly userService: UserService,
        private readonly orderService: OrderService,
    ) { }


    async checkBalance(apiKey: string, secretKey: string) {
        return await this.binanceApiHandler(apiKey, secretKey, async (binance, binanceTest) => {

            const safeApiCall = (apiCall, identifier) => {
                return apiCall.then(
                    result => ({ result, identifier, success: true }),
                    error => ({ error, identifier, success: false })
                );
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
                } else {
                    throw new Error("Invalid API response: " + result.msg);
                }
            } else {
                throw new Error("Invalid Api Key or Secret Key");
            }
        });


    }





    // Create Order
    async createOrder(strategy: Strategy, credentials: any, orderDto: OrderWebHookDto) {
        let { apiKey, apiSecret, isTestMode, _id: userId } = credentials;
        return await this.binanceApiHandler(apiKey, apiSecret, async (binance: BinanceType, binanceTest: BinanceType) => {
            try {

                let { balance }: any = await this.userService.getBinanceBalance(userId);
                let instance = isTestMode ? binanceTest : binance;

                let { symbol, side, type, quantity, price, leverage, isolated } = orderDto;

                // General Value Validation
                if (!symbol || !side || !type || !quantity || !price) {
                    throw new Error("Missing required parameters");
                }

                let amounPercentage = calculateParentTradePercentage(strategy.capital, quantity, price);
                let [qty, cost] = calculateTradeDetailsForUser(balance, amounPercentage, price)

                // Trade Amount Validation
                if (cost > strategy.tradeMaxAmount) {
                    cost = strategy.tradeMaxAmount;
                    quantity = calculateQuantity(cost, price);
                } else {
                    quantity = qty;
                }

                // Trade Leverage Validation
                if (leverage > strategy.tradeMaxLeverage) {
                    leverage = strategy.tradeMaxLeverage;
                }

                // let order = await instance.futuresOrder({
                //     symbol: symbol,
                //     side: side,
                //     type: type,
                //     quantity: quantity,
                //     price: price,
                //     newOrderRespType: "FULL",
                //     leverage: leverage,
                //     isolated: isolated,
                // });
                let order = await instance.futuresOrder(side, symbol, quantity, price, {
                    type,
                });
                console.log(order)

                if (order?.code) {
                    return {
                        userId,
                        success: false,
                        message: order.msg
                    }
                }
                return {
                    userId,
                    order,
                    success: true
                };
            } catch (err) {
                console.log(err)
                return {
                    userId,
                    success: false,
                    message: err.msg
                }
            }
        });
    }


    async createStrategyOrders(strategy: Strategy, userCredentials: User[], OrderWebHookDto: OrderWebHookDto) {
        let credentials = userCredentials.map(user => ({ _id: user._id, apiKey: user?.binanceCredentials?.apiKey, apiSecret: user?.binanceCredentials?.apiSecret, isTestMode: user?.binanceCredentials?.isTestMode }));

        let finalCredentials = credentials.filter(credential => credential.apiKey && credential.apiSecret);

        if (finalCredentials.length == 0) {
            throw new Error("No valid credentials found");
        }

        let accauntOrderPromises = finalCredentials.map(async (credential) => {
            return await this.createOrder(strategy, credential, OrderWebHookDto);
        });

        let result = await Promise.all(accauntOrderPromises);
        console.log(result)
        return result;
    }




    async binanceApiHandler(apiKey: string, secretKey: string, action: (binance: BinanceType, binanceTest: BinanceType) => Promise<any>) {

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
        } catch (err) {
            throw err;
        } finally {
            binance = null;
            binanceTest = null;
        }
    }



}
