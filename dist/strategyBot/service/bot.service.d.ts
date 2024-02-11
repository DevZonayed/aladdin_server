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
import { SortBy } from 'src/common/enum/enum-sort-by';
import { StrategyService } from 'src/strategy/service/strategy.service';
import { CreateBotDto } from '../dto/create-bot.dto';
import { UpdateBotDto } from '../dto/update-bot.dto';
import { UpdateBotTokenDto } from '../dto/update-tokens.dto';
import { Bot } from '../entities/bot.entity';
import { WorkerService } from '../worker/service/worker.service';
export declare class BotService {
    private readonly BotModel;
    private readonly workerService;
    private readonly strategyService;
    constructor(BotModel: Model<Bot>, workerService: WorkerService, strategyService: StrategyService);
    create(createBotDto: CreateBotDto): Promise<{
        statusCode: HttpStatus;
        response: string;
        message: string;
        payload: any;
    }>;
    handleStartBot(id: string): Promise<{
        statusCode: HttpStatus;
        response: string;
        message: string;
        payload: any;
    }>;
    handleStopBot(id: string): Promise<{
        statusCode: HttpStatus;
        response: string;
        message: string;
        payload: any;
    }>;
    getBotStatus(id: string): Promise<{
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
    update(id: string, updateBotDto: UpdateBotDto): Promise<{
        statusCode: HttpStatus;
        response: string;
        message: string;
        payload: any;
    }>;
    updateBotToken(id: string, updateBotTokenDto: UpdateBotTokenDto): Promise<{
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
}
