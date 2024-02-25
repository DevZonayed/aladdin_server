import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FAIELD_RESPONSE, SOMETHING_WENT_WRONG, SUCCESS_RESPONSE, createApiResponse } from 'src/common/constants';
import { NotificationService } from 'src/notification/mail/service/notification.service';
import { StrategyService } from 'src/strategy/service/strategy.service';
import { Bot } from 'src/strategyBot/entities/bot.entity';
import { WorkerManager, WorkerManagerInstance } from "../cache/worker.cache";
import { sendErrorNotificationToAdmins, sendInfoNotificationToAdmins, sendWarnNotificationToAdmins } from '../utils/botMail.utils';
import { ScrapWorker } from './scraperService';

@Injectable()
export class WorkerService {

    private workerCacheService: WorkerManager = WorkerManagerInstance
    constructor(
        @InjectModel(Bot.name)
        private readonly BotModel: Model<Bot>,
        private readonly strategyService: StrategyService,
        private readonly mailNotificationService: NotificationService,
    ) { }

    async handleStartWorker(
        botDetails: Bot
    ) {
        try {

            let existBot: ScrapWorker = await this.workerCacheService.getWorker(botDetails?._id?.toString())
            if (existBot) {
                this.workerCacheService.deleteWorker(botDetails?._id?.toString())
            }

            let { csrfToken = "", isPublic, p20t = "" } = botDetails;
            if (!isPublic && (csrfToken == "" || p20t == "")) {
                let message = `${botDetails.BotName}'s Token Missing`
                sendErrorNotificationToAdmins(this.mailNotificationService, message)

                return createApiResponse(
                    HttpStatus.BAD_REQUEST,
                    FAIELD_RESPONSE,
                    "csrfToken or p20t is missing",
                    [],
                );
            }

            let worker = new ScrapWorker(this.strategyService, botDetails, this.mailNotificationService, this.BotModel)
            this.workerCacheService.addWorker(worker);
            await worker.startWorker();

            let message = `${botDetails.BotName} Bot Started`
            sendInfoNotificationToAdmins(this.mailNotificationService, message)

            return createApiResponse(
                HttpStatus.ACCEPTED,
                SUCCESS_RESPONSE,
                "Worker Started Successfully",
                [],
            );
        } catch (err) {
            let message = `Something went wrong while starting ${botDetails.BotName} bot Error: ${err.message}`
            sendErrorNotificationToAdmins(this.mailNotificationService, message)
            return createApiResponse(
                HttpStatus.EXPECTATION_FAILED,
                FAIELD_RESPONSE,
                SOMETHING_WENT_WRONG,
                err.message,
            );
        }
    }

    async handleStopWorker(botDetails: Bot) {
        try {

            let existBot: ScrapWorker = await this.workerCacheService.getWorker(botDetails.BotName)
            if (!existBot) {
                let message = `You are trying to stop ${botDetails.BotName} Bot. But it not exist`
                sendWarnNotificationToAdmins(this.mailNotificationService, message)

                return createApiResponse(
                    HttpStatus.NOT_FOUND,
                    SUCCESS_RESPONSE,
                    "Worker Not Found",
                    [],
                );
            }
            await existBot.stopWorker();

            let message = `${botDetails.BotName} bot strated!`
            sendInfoNotificationToAdmins(this.mailNotificationService, message)
            return createApiResponse(
                HttpStatus.ACCEPTED,
                SUCCESS_RESPONSE,
                "Worker Stopped Successfully",
                [],
            )
        } catch (err) {
            let message = `${botDetails.BotName} bot not stoped! Error: ${err?.message}`
            sendErrorNotificationToAdmins(this.mailNotificationService, message)
            return createApiResponse(
                HttpStatus.BAD_REQUEST,
                FAIELD_RESPONSE,
                "Something Went Wrong",
                [],
            );
        }

    }

    async getBotStatus(botDetails: Bot) {
        let existBot: ScrapWorker = await this.workerCacheService.getWorker(botDetails.BotName)

        if (!existBot) {
            return createApiResponse(
                HttpStatus.NOT_FOUND,
                SUCCESS_RESPONSE,
                "Worker Not Found",
                [],
            );
        }

        let botStatus = existBot.getWorkerStatus()
        return createApiResponse(
            HttpStatus.ACCEPTED,
            SUCCESS_RESPONSE,
            "Worker status getting success",
            botStatus,
        );
    }


}
