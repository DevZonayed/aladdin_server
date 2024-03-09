/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { HttpStatus } from '@nestjs/common';
import { Model } from 'mongoose';
import { BinanceService } from 'src/binance/service/binance.service';
import { SortBy } from 'src/common/enum/enum-sort-by';
import { UserService } from 'src/user/service/user.service';
import { CreateStrategyDto } from '../dto/create-strategy.dto';
import { OrderWebHookDto } from '../dto/order_webhook-dto';
import { UpdateStrategyDto } from '../dto/update-strategy.dto';
import { Strategy } from '../entities/strategy.entity';
export declare class StrategyService {
    private readonly StrategyModel;
    private readonly binanceService;
    private readonly userService;
    constructor(StrategyModel: Model<Strategy>, binanceService: BinanceService, userService: UserService);
    create(createStrategyDto: CreateStrategyDto): Promise<{
        statusCode: HttpStatus;
        response: string;
        message: string;
        payload: any;
    }>;
    findAll(page: number, limit: number, order: string, sort: SortBy, search: string, startDate: Date, endDate: Date): Promise<any>;
    findOne(id: string): Promise<{
        statusCode: HttpStatus;
        response: string;
        message: string;
        payload: any;
    }>;
    findBySlug(slug: string): Promise<{
        statusCode: HttpStatus;
        response: string;
        message: string;
        payload: any;
    }>;
    update(id: string, updateStrategyDto: UpdateStrategyDto): Promise<{
        statusCode: HttpStatus;
        response: string;
        message: string;
        payload: any;
    }>;
    remove(id: string): Promise<{
        statusCode: HttpStatus;
        response: string;
        message: string;
        payload: any;
    }>;
    handleWebHook(endPoint: string, order: OrderWebHookDto): Promise<{
        statusCode: HttpStatus;
        response: string;
        message: string;
        payload: any;
    } | {
        successResults: any;
        failedResults: PromiseSettledResult<any>[];
        message: string;
    }>;
}
