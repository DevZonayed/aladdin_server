import { MailNotificationTypeEnum } from "src/notification/mail/enum/mail.type.enum"
import { NotificationService } from "src/notification/mail/service/notification.service"

export async function sendErrorNotificationToAdmins(mailNotificationService: NotificationService, message: string) {
    await mailNotificationService.sendNotificationToAllAdmins({
        subject: "Critical Error !❌❌",
        message: `${message}`,
        type: MailNotificationTypeEnum.ERROR,
    })
}

export async function sendInfoNotificationToAdmins(mailNotificationService: NotificationService, message: string) {
    await mailNotificationService.sendNotificationToAllAdmins({
        subject: "Alaadin Information",
        message: `${message}`,
        type: MailNotificationTypeEnum.INFO,
    })
}

export async function sendWarnNotificationToAdmins(mailNotificationService: NotificationService, message: string) {
    await mailNotificationService.sendNotificationToAllAdmins({
        subject: "Alaadin Warning",
        message: `${message}`,
        type: MailNotificationTypeEnum.WARNING,
    })
}

export async function sendSuccessNotificationToAdmins(mailNotificationService: NotificationService, message: string) {
    await mailNotificationService.sendNotificationToAllAdmins({
        subject: "Alaadin Info Success",
        message: `${message}`,
        type: MailNotificationTypeEnum.WARNING,
    })
}
