import { NotificationService } from "src/notification/mail/service/notification.service";
import { StrategyService } from "src/strategy/service/strategy.service";
import { Bot } from "src/strategyBot/entities/bot.entity";
import { DataWatcher } from "./watcherService";
export declare class ScrapWorker {
    dataWatcher: DataWatcher;
    updateTime: number;
    isWorking: boolean;
    errorMessage: string;
    scrapId: string;
    p20t: string;
    csrfToken: string;
    strName: string;
    updateTimerId: any;
    intervalId: any;
    tokenValidateTimerId: any;
    strategyService: StrategyService;
    botDto: Bot;
    mailNotificationService: NotificationService;
    configData: any;
    constructor(strategyService: StrategyService, botDto: any, mailNotificationService: NotificationService);
    getAllData(): {
        scrapId: string;
        p20t: string;
        csrfToken: string;
        isWorking: boolean;
        lastUpdate: string;
    };
    updateProperty(key: any, value: any): boolean;
    isCompleteScrapWorker(): boolean;
    checkUpdates(): void;
    startScrapWorker(): boolean;
    stopScrapWorker(): boolean;
    orgData(row: any): void;
    handleCopyTradeRequest({ scrapId, p20t, csrfToken }: {
        scrapId: any;
        p20t: any;
        csrfToken: any;
    }): Promise<unknown>;
    checkTokenValidity(): void;
    handleEvents(): void;
    notifyTelegram(message: any): void;
    scrapAndUpdate(): void;
}
