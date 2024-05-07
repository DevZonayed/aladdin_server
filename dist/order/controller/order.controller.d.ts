import { SortBy } from 'src/common/enum/enum-sort-by';
import { OrderService } from '../service/order.service';
export declare class OrderController {
    private readonly orderService;
    constructor(orderService: OrderService);
    findAllOpenOrderByStrategy(strategyId: string, page: number, limit: number, order: string, sort: SortBy, search: string, startDate: Date, endDate: Date): Promise<any>;
    closeOrder(orderId: string): Promise<{
        statusCode: import("@nestjs/common").HttpStatus;
        response: string;
        message: string;
        payload: any;
    }>;
}
