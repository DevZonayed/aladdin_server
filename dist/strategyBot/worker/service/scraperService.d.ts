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
import { Model } from "mongoose";
import { NotificationService } from "src/notification/mail/service/notification.service";
import { StrategyService } from "src/strategy/service/strategy.service";
import { Bot } from "src/strategyBot/entities/bot.entity";
export declare class ScrapWorker {
    isWorking: boolean;
    private dataWatcher;
    private updateTime;
    private errorMessage;
    private scrapId;
    private p2ot;
    private csrfToken;
    private strName;
    private updateTimerId;
    private intervalId;
    private tokenValidateTimerId;
    private strategyService;
    private botDto;
    private BotModel;
    private mailNotificationService;
    private configData;
    constructor(strategyService: StrategyService, botDto: any, mailNotificationService: NotificationService, BotModel: Model<Bot>);
    getWorkerStatus(): {
        scrapId: string;
        p2ot: string;
        csrfToken: string;
        isWorking: boolean;
        lastUpdate: string;
        openOrders: any[];
    };
    updateWorkerProperty(key: any, value: any): boolean;
    monitorMissedUpdates(): void;
    startWorker(): Promise<boolean>;
    stopWorker(): Promise<boolean>;
    organizeAndWatchData(row: any): void;
    processCopyTradeRequest({ scrapId, p2ot, csrfToken }: {
        scrapId: any;
        p2ot: any;
        csrfToken: any;
    }): Promise<unknown>;
    checkTokenValidity(): void;
    setupEventListeners(): void;
    notifyTelegram(message: any): void;
    scrapAndUpdate(): void;
    handleCreateOrder(order: any): Promise<void>;
    handleUpdateOrder(prevOrder: any, newOrder: any): Promise<void>;
    handleCloseOrder(order: any): Promise<void>;
    updateBotDb(id: string, payload: any): Promise<void>;
}
