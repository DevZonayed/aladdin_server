import { SortBy } from 'src/common/enum/enum-sort-by';
import { CreateBotDto } from '../dto/create-bot.dto';
import { UpdateBotDto } from '../dto/update-bot.dto';
import { BotService } from '../service/bot.service';
export declare class BotController {
    private readonly BotService;
    constructor(BotService: BotService);
    create(createStrategyDto: CreateBotDto, requestData: Request): Promise<any>;
    start(requestData: Request, id: string): Promise<any>;
    stop(requestData: Request, id: string): Promise<any>;
    findAll(page: number, limit: number, order: string, sort: SortBy, search: string, startDate: Date, endDate: Date): Promise<any>;
    findOne(id: string): Promise<{
        statusCode: import("@nestjs/common").HttpStatus;
        response: string;
        message: string;
        payload: any;
    }>;
    update(id: string, updateStrategyDto: UpdateBotDto): Promise<any>;
    remove(id: string): Promise<{
        statusCode: import("@nestjs/common").HttpStatus;
        response: string;
        message: string;
        payload: any;
    }>;
}
