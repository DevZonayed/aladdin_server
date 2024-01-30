import { Cache } from 'cache-manager';
import BinanceType from "node-binance-api";
import { OrderService } from 'src/order/service/order.service';
import { OrderWebHookDto } from 'src/strategy/dto/order_webhook-dto';
import { Strategy } from 'src/strategy/entities/strategy.entity';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/service/user.service';
import { BinanceExchaneService } from './exchangeInfo.service';
export declare class BinanceService {
    private readonly userService;
    private readonly orderService;
    private cacheService;
    binanceExchaneService: BinanceExchaneService;
    constructor(userService: UserService, orderService: OrderService, cacheService: Cache);
    checkBalance(apiKey: string, secretKey: string): Promise<any>;
    createStrategyOrders(strategy: Strategy, userCredentials: User[], OrderWebHookDto: OrderWebHookDto): Promise<any[]>;
    saveOrders(results: any): Promise<any[]>;
    createFutureOrder(strategy: Strategy, credentials: any, orderDto: OrderWebHookDto): Promise<any>;
    handleFutureOpenOrdersClose(instance: BinanceType, symbol: string, side: string, quantity?: number): Promise<any>;
    calculateTotalQuantity(orders: any): any;
    getOrdersToCancel(orders: any, targetQty: number, targetSide: String): any[];
    setLeverageAndMarginType(instance: any, symbol: any, leverage: any, isolated: any, userId: any): Promise<boolean>;
    placeOrder(instance: any, symbol: any, side: any, quantity: any, price: any): Promise<any>;
    placeFutureBuyOrder(instance: BinanceType, symbol: String, side: string, type: string, quantity: number, price: number): Promise<any>;
    placeFutureSellOrder(instance: BinanceType, symbol: String, side: string, type: string, quantity: number, price: number): Promise<any>;
    createFutureOrderResponse(userId: any, data: any, orderDto: any, strategy: any, isSuccess: any, ratio?: any): {
        userId: any;
        orderDto: any;
        strategy: any;
        success: boolean;
        message: any;
        ratio?: undefined;
        order?: undefined;
    } | {
        userId: any;
        orderDto: any;
        strategy: any;
        ratio: any;
        order: any;
        success: boolean;
        message?: undefined;
    };
    binanceApiHandler(apiKey: string, secretKey: string, action: (binance: BinanceType, binanceTest: BinanceType) => Promise<any>): Promise<any>;
}
