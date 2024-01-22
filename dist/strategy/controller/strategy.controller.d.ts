import { Request } from 'express';
import { SortBy } from '../../common/enum/enum-sort-by';
import { CreateStrategyDto } from '../dto/create-strategy.dto';
import { UpdateStrategyDto } from '../dto/update-strategy.dto';
import { StrategyService } from '../service/strategy.service';
export declare class StrategyController {
    private readonly StrategyService;
    constructor(StrategyService: StrategyService);
    handleWebhook(endpoint: string): Promise<{
        statusCode: import("@nestjs/common").HttpStatus;
        response: string;
        message: string;
        payload: any;
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
