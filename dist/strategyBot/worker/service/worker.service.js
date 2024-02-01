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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkerService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const constants_1 = require("../../../common/constants");
const notification_service_1 = require("../../../notification/mail/service/notification.service");
const strategy_service_1 = require("../../../strategy/service/strategy.service");
const bot_entity_1 = require("../../entities/bot.entity");
const worker_cache_1 = require("../cache/worker.cache");
const botMail_utils_1 = require("../utils/botMail.utils");
const scraperService_1 = require("./scraperService");
let WorkerService = class WorkerService {
    constructor(BotModel, strategyService, mailNotificationService) {
        this.BotModel = BotModel;
        this.strategyService = strategyService;
        this.mailNotificationService = mailNotificationService;
        this.workerCacheService = worker_cache_1.WorkerManagerInstance;
    }
    async handleStartWorker(botDetails) {
        try {
            let existBot = await this.workerCacheService.getWorker(botDetails._id);
            if (existBot) {
                if (existBot.isWorking) {
                    return (0, constants_1.createApiResponse)(common_1.HttpStatus.ACCEPTED, constants_1.SUCCESS_RESPONSE, "Already Exist", []);
                }
                else {
                    existBot.startWorker();
                    let message = `${botDetails.BotName} Bot Started`;
                    await (0, botMail_utils_1.sendInfoNotificationToAdmins)(this.mailNotificationService, message);
                    return (0, constants_1.createApiResponse)(common_1.HttpStatus.ACCEPTED, constants_1.SUCCESS_RESPONSE, "Already Exist", []);
                }
            }
            let { csrfToken = "", isPublic, p20t = "" } = botDetails;
            if (!isPublic && (csrfToken == "" || p20t == "")) {
                let message = `${botDetails.BotName}'s Token Missing`;
                (0, botMail_utils_1.sendErrorNotificationToAdmins)(this.mailNotificationService, message);
                return (0, constants_1.createApiResponse)(common_1.HttpStatus.BAD_REQUEST, constants_1.FAIELD_RESPONSE, "csrfToken or p20t is missing", []);
            }
            let worker = new scraperService_1.ScrapWorker(this.strategyService, botDetails, this.mailNotificationService, this.BotModel);
            this.workerCacheService.addWorker(worker);
            await worker.startWorker();
            let message = `${botDetails.BotName} Bot Started`;
            (0, botMail_utils_1.sendInfoNotificationToAdmins)(this.mailNotificationService, message);
            return (0, constants_1.createApiResponse)(common_1.HttpStatus.ACCEPTED, constants_1.SUCCESS_RESPONSE, "Worker Started Successfully", []);
        }
        catch (err) {
            let message = `Something went wrong while starting ${botDetails.BotName} bot Error: ${err.message}`;
            (0, botMail_utils_1.sendErrorNotificationToAdmins)(this.mailNotificationService, message);
            return (0, constants_1.createApiResponse)(common_1.HttpStatus.EXPECTATION_FAILED, constants_1.FAIELD_RESPONSE, constants_1.SOMETHING_WENT_WRONG, err.message);
        }
    }
    async handleStopWorker(botDetails) {
        try {
            let existBot = await this.workerCacheService.getWorker(botDetails.BotName);
            if (!existBot) {
                let message = `You are trying to stop ${botDetails.BotName} Bot. But it not exist`;
                (0, botMail_utils_1.sendWarnNotificationToAdmins)(this.mailNotificationService, message);
                return (0, constants_1.createApiResponse)(common_1.HttpStatus.NOT_FOUND, constants_1.SUCCESS_RESPONSE, "Worker Not Found", []);
            }
            await existBot.stopWorker();
            let message = `${botDetails.BotName} bot strated!`;
            (0, botMail_utils_1.sendInfoNotificationToAdmins)(this.mailNotificationService, message);
            return (0, constants_1.createApiResponse)(common_1.HttpStatus.ACCEPTED, constants_1.SUCCESS_RESPONSE, "Worker Stopped Successfully", []);
        }
        catch (err) {
            let message = `${botDetails.BotName} bot not stoped! Error: ${err?.message}`;
            (0, botMail_utils_1.sendErrorNotificationToAdmins)(this.mailNotificationService, message);
            return (0, constants_1.createApiResponse)(common_1.HttpStatus.BAD_REQUEST, constants_1.FAIELD_RESPONSE, "Something Went Wrong", []);
        }
    }
    async getBotStatus(botDetails) {
        let existBot = await this.workerCacheService.getWorker(botDetails.BotName);
        if (!existBot) {
            return (0, constants_1.createApiResponse)(common_1.HttpStatus.NOT_FOUND, constants_1.SUCCESS_RESPONSE, "Worker Not Found", []);
        }
        let botStatus = existBot.getWorkerStatus();
        return (0, constants_1.createApiResponse)(common_1.HttpStatus.ACCEPTED, constants_1.SUCCESS_RESPONSE, "Worker status getting success", botStatus);
    }
};
exports.WorkerService = WorkerService;
exports.WorkerService = WorkerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(bot_entity_1.Bot.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        strategy_service_1.StrategyService,
        notification_service_1.NotificationService])
], WorkerService);
//# sourceMappingURL=worker.service.js.map