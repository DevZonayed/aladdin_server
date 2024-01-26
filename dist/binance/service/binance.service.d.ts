import BinanceType from "node-binance-api";
import { OrderService } from 'src/order/service/order.service';
import { OrderWebHookDto } from 'src/strategy/dto/order_webhook-dto';
import { Strategy } from 'src/strategy/entities/strategy.entity';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/service/user.service';
export declare class BinanceService {
    private readonly userService;
    private readonly orderService;
    constructor(userService: UserService, orderService: OrderService);
    checkBalance(apiKey: string, secretKey: string): Promise<any>;
    createOrder(strategy: Strategy, credentials: any, orderDto: OrderWebHookDto): Promise<any>;
    createStrategyOrders(strategy: Strategy, userCredentials: User[], OrderWebHookDto: OrderWebHookDto): Promise<any[]>;
    binanceApiHandler(apiKey: string, secretKey: string, action: (binance: BinanceType, binanceTest: BinanceType) => Promise<any>): Promise<any>;
}
