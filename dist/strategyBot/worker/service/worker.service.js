"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkerService = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("../../../common/constants");
const mail_type_enum_1 = require("../../../notification/mail/enum/mail.type.enum");
const notification_service_1 = require("../../../notification/mail/service/notification.service");
const strategy_service_1 = require("../../../strategy/service/strategy.service");
const worker_cache_1 = require("../cache/worker.cache");
const scraperService_1 = require("./scraperService");
let WorkerService = class WorkerService {
    constructor(strategyService, mailNotificationService) {
        this.strategyService = strategyService;
        this.mailNotificationService = mailNotificationService;
        this.workerCacheService = worker_cache_1.WorkerManagerInstance;
    }
    async handleStartWorker(botDetails) {
        let existBot = await this.workerCacheService.getWorker(botDetails._id);
        if (existBot) {
            if (existBot.isWorking) {
                let message = `${botDetails.BotName} Bot Already Exist`;
                await this.mailNotificationService.sendNotificationToAllAdmins({
                    message,
                    subject: 'Bot Already Exist',
                    type: mail_type_enum_1.MailNotificationTypeEnum.INFO
                });
                return (0, constants_1.createApiResponse)(common_1.HttpStatus.ACCEPTED, constants_1.SUCCESS_RESPONSE, "Already Exist", []);
            }
            else {
                existBot.startScrapWorker();
                let message = `${botDetails.BotName} Bot Started`;
                await this.mailNotificationService.sendNotificationToAllAdmins({
                    message,
                    subject: 'Bot Started',
                    type: mail_type_enum_1.MailNotificationTypeEnum.INFO
                });
                return (0, constants_1.createApiResponse)(common_1.HttpStatus.ACCEPTED, constants_1.SUCCESS_RESPONSE, "Already Exist", []);
            }
        }
        let { csrfToken = "", isPublic, p2ot = "" } = botDetails;
        if (!isPublic && (csrfToken == "" || p2ot == "")) {
            let message = `${botDetails.BotName}'s Token Missing`;
            await this.mailNotificationService.sendNotificationToAllAdmins({
                message,
                subject: 'Token Missing',
                type: mail_type_enum_1.MailNotificationTypeEnum.ERROR
            });
            return (0, constants_1.createApiResponse)(common_1.HttpStatus.BAD_REQUEST, constants_1.FAIELD_RESPONSE, "csrfToken or p20t is missing", []);
        }
        let worker = new scraperService_1.ScrapWorker(this.strategyService, botDetails, this.mailNotificationService);
        worker.startScrapWorker();
        this.workerCacheService.addWorker(worker);
        let message = `${botDetails.BotName} Bot Started`;
        await this.mailNotificationService.sendNotificationToAllAdmins({
            message,
            subject: 'Bot Started',
            type: mail_type_enum_1.MailNotificationTypeEnum.INFO
        });
        return (0, constants_1.createApiResponse)(common_1.HttpStatus.ACCEPTED, constants_1.SUCCESS_RESPONSE, "Worker Started Successfully", []);
    }
    async handleStopWorker(botDetails) {
        try {
            let existBot = await this.workerCacheService.getWorker(botDetails._id);
            if (!existBot) {
                let message = `You are trying to stop ${botDetails.BotName} Bot. But it not exist`;
                await this.mailNotificationService.sendNotificationToAllAdmins({
                    message,
                    subject: 'Bot Not Found',
                    type: mail_type_enum_1.MailNotificationTypeEnum.WARNING
                });
                return (0, constants_1.createApiResponse)(common_1.HttpStatus.NOT_FOUND, constants_1.SUCCESS_RESPONSE, "Worker Not Found", []);
            }
            await existBot.stopScrapWorker();
            let message = `${botDetails.BotName} bot strated!`;
            await this.mailNotificationService.sendNotificationToAllAdmins({
                message,
                subject: 'Bot Stopped',
                type: mail_type_enum_1.MailNotificationTypeEnum.SUCCESS
            });
            return (0, constants_1.createApiResponse)(common_1.HttpStatus.ACCEPTED, constants_1.SUCCESS_RESPONSE, "Worker Stopped Successfully", []);
        }
        catch (err) {
            let message = `${botDetails.BotName} bot not stoped! Error: ${err?.message}`;
            await this.mailNotificationService.sendNotificationToAllAdmins({
                message,
                subject: 'Bot Error',
                type: mail_type_enum_1.MailNotificationTypeEnum.ERROR
            });
            return (0, constants_1.createApiResponse)(common_1.HttpStatus.BAD_REQUEST, constants_1.FAIELD_RESPONSE, "Something Went Wrong", []);
        }
    }
};
exports.WorkerService = WorkerService;
exports.WorkerService = WorkerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [strategy_service_1.StrategyService,
        notification_service_1.NotificationService])
], WorkerService);
//# sourceMappingURL=worker.service.js.map