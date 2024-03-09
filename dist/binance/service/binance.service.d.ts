import { Cache } from 'cache-manager';
import { NotificationService } from 'src/notification/mail/service/notification.service';
import { OrderService } from 'src/order/service/order.service';
import { OrderWebHookDto } from 'src/strategy/dto/order_webhook-dto';
import { Strategy } from 'src/strategy/entities/strategy.entity';
import { StrategyService } from 'src/strategy/service/strategy.service';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/service/user.service';
import { BinanceExchaneService } from './exchangeInfo.service';
export declare class BinanceService {
    private readonly userService;
    private readonly orderService;
    private readonly strategyService;
    private readonly notificationService;
    private cacheService;
    binanceExchaneService: BinanceExchaneService;
    constructor(userService: UserService, orderService: OrderService, strategyService: StrategyService, notificationService: NotificationService, cacheService: Cache);
    checkBalance(apiKey: string, secretKey: string): Promise<any>;
    private safePromiseBuild;
    createStrategyOrders(strategy: Strategy, userCredentials: User[], OrderWebHookDto: OrderWebHookDto): Promise<{
        successResults: PromiseSettledResult<any>[];
        failedResults: PromiseSettledResult<any>[];
        message: string;
    }>;
    private persistOrderResults;
    private handleOrderResultProcessing;
    private retrieveDataFromOrderResult;
    private buildNewOrderPayload;
    private updateExistingOrder;
    private computeOrderUpdateDetails;
    private computeClosedOrderQuantity;
    private computeOrderTotalQuantity;
    private generateFutureOrders;
    private processClosingOfOpenFutureOrders;
    private computeTotalOrderQuantity;
    private identifyOrdersForCancellation;
    private configureLeverageAndMarginSettings;
    private executeFutureBuyOrder;
    private executeFutureSellOrder;
    private generateFutureOrdersResponse;
    private getBinanceRiskPositionCount;
    private getBinanceOpenOrderCount;
    private getBinanceAccountOrderCount;
    private executeBinanceApiAction;
    private updateOrderForNewSignal;
    private updateOrderForReEntrySignal;
    private handleNoPreviousOrder;
    private handleOrderBounced;
}
