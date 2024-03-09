import { SortBy } from 'src/common/enum/enum-sort-by';
import { CreateStrategyDto } from '../dto/create-strategy.dto';
import { OrderWebHookDto } from '../dto/order_webhook-dto';
import { UpdateStrategyDto } from '../dto/update-strategy.dto';
import { StrategyService } from '../service/strategy.service';
export declare class StrategyController {
    private readonly StrategyService;
    constructor(StrategyService: StrategyService);
    handleWebhook(endpoint: string, orderWebHookDto: OrderWebHookDto): Promise<{
        statusCode: import("@nestjs/common").HttpStatus;
        response: string;
        message: string;
        payload: any;
    } | {
        successResults: PromiseSettledResult<any>[];
        failedResults: PromiseSettledResult<any>[];
        message: string;
    }>;
    create(createStrategyDto: CreateStrategyDto, requestData: Request): Promise<any>;
    findAll(page: number, limit: number, order: string, sort: SortBy, search: string, startDate: Date, endDate: Date): Promise<any>;
    findOne(id: string): Promise<{
        statusCode: import("@nestjs/common").HttpStatus;
        response: string;
        message: string;
        payload: any;
    }>;
    update(id: string, updateStrategyDto: UpdateStrategyDto): Promise<any>;
    remove(id: string): Promise<{
        statusCode: import("@nestjs/common").HttpStatus;
        response: string;
        message: string;
        payload: any;
    }>;
}
