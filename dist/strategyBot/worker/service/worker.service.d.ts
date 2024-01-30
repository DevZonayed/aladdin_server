import { HttpStatus } from '@nestjs/common';
import { NotificationService } from 'src/notification/mail/service/notification.service';
import { StrategyService } from 'src/strategy/service/strategy.service';
import { Bot } from 'src/strategyBot/entities/bot.entity';
export declare class WorkerService {
    private readonly strategyService;
    private readonly mailNotificationService;
    private readonly workerCacheService;
    constructor(strategyService: StrategyService, mailNotificationService: NotificationService);
    handleStartWorker(botDetails: Bot): Promise<{
        statusCode: HttpStatus;
        response: string;
        message: string;
        payload: any;
    }>;
    handleStopWorker(botDetails: Bot): Promise<{
        statusCode: HttpStatus;
        response: string;
        message: string;
        payload: any;
    }>;
}
