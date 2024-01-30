import { HttpStatus, Injectable } from '@nestjs/common';
import { FAIELD_RESPONSE, SUCCESS_RESPONSE, createApiResponse } from 'src/common/constants';
import { MailNotificationTypeEnum } from 'src/notification/mail/enum/mail.type.enum';
import { NotificationService } from 'src/notification/mail/service/notification.service';
import { StrategyService } from 'src/strategy/service/strategy.service';
import { Bot } from 'src/strategyBot/entities/bot.entity';
import { WorkerManager, WorkerManagerInstance } from "../cache/worker.cache";
import { ScrapWorker } from './scraperService';

@Injectable()
export class WorkerService {

    private readonly workerCacheService: WorkerManager = WorkerManagerInstance
    constructor(
        private readonly strategyService: StrategyService,
        private readonly mailNotificationService: NotificationService,
    ) { }

    async handleStartWorker(
        botDetails: Bot
    ) {
        let existBot: ScrapWorker = await this.workerCacheService.getWorker(botDetails._id)
        if (existBot) {
            if (existBot.isWorking) {
                let message = `${botDetails.BotName} Bot Already Exist`
                await this.mailNotificationService.sendNotificationToAllAdmins({
                    message,
                    subject: 'Bot Already Exist',
                    type: MailNotificationTypeEnum.INFO
                })
                return createApiResponse(
                    HttpStatus.ACCEPTED,
                    SUCCESS_RESPONSE,
                    "Already Exist",
                    [],
                );

            } else {
                existBot.startScrapWorker();
                let message = `${botDetails.BotName} Bot Started`
                await this.mailNotificationService.sendNotificationToAllAdmins({
                    message,
                    subject: 'Bot Started',
                    type: MailNotificationTypeEnum.INFO
                })

                return createApiResponse(
                    HttpStatus.ACCEPTED,
                    SUCCESS_RESPONSE,
                    "Already Exist",
                    [],
                );
            }
        }

        let { csrfToken = "", isPublic, p2ot = "" } = botDetails;

        if (!isPublic && (csrfToken == "" || p2ot == "")) {
            let message = `${botDetails.BotName}'s Token Missing`
            await this.mailNotificationService.sendNotificationToAllAdmins({
                message,
                subject: 'Token Missing',
                type: MailNotificationTypeEnum.ERROR
            })

            return createApiResponse(
                HttpStatus.BAD_REQUEST,
                FAIELD_RESPONSE,
                "csrfToken or p20t is missing",
                [],
            );
        }

        let worker = new ScrapWorker(this.strategyService, botDetails, this.mailNotificationService)
        worker.startScrapWorker();

        this.workerCacheService.addWorker(worker);

        let message = `${botDetails.BotName} Bot Started`
        await this.mailNotificationService.sendNotificationToAllAdmins({
            message,
            subject: 'Bot Started',
            type: MailNotificationTypeEnum.INFO
        })


        return createApiResponse(
            HttpStatus.ACCEPTED,
            SUCCESS_RESPONSE,
            "Worker Started Successfully",
            [],
        );
    }



    async handleStopWorker(botDetails: Bot) {
        try {

            let existBot: ScrapWorker = await this.workerCacheService.getWorker(botDetails._id)
            if (!existBot) {
                let message = `You are trying to stop ${botDetails.BotName} Bot. But it not exist`
                await this.mailNotificationService.sendNotificationToAllAdmins({
                    message,
                    subject: 'Bot Not Found',
                    type: MailNotificationTypeEnum.WARNING
                })

                return createApiResponse(
                    HttpStatus.NOT_FOUND,
                    SUCCESS_RESPONSE,
                    "Worker Not Found",
                    [],
                );
            }
            await existBot.stopScrapWorker();

            let message = `${botDetails.BotName} bot strated!`
            await this.mailNotificationService.sendNotificationToAllAdmins({
                message,
                subject: 'Bot Stopped',
                type: MailNotificationTypeEnum.SUCCESS
            })
            return createApiResponse(
                HttpStatus.ACCEPTED,
                SUCCESS_RESPONSE,
                "Worker Stopped Successfully",
                [],
            )
        } catch (err) {
            let message = `${botDetails.BotName} bot not stoped! Error: ${err?.message}`
            await this.mailNotificationService.sendNotificationToAllAdmins({
                message,
                subject: 'Bot Error',
                type: MailNotificationTypeEnum.ERROR
            })
            return createApiResponse(
                HttpStatus.BAD_REQUEST,
                FAIELD_RESPONSE,
                "Something Went Wrong",
                [],
            );
        }

    }


}
