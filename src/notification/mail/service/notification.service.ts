import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { UserRole } from 'src/common/enum';
import { UserService } from 'src/user/service/user.service';
import { MailNotificationTypeEnum } from '../enum/mail.type.enum';
import { notificationErrorTemplate, notificationExitingTemplate, notificationInfoTemplate, notificationSuccessTemplate, notificationWarningTemplate } from '../templates/notification.template';

@Injectable()
export class NotificationService {
    constructor(
        private readonly mailService: MailerService,
        private readonly userService: UserService,
    ) { }

    // Send notification to all admins
    async sendNotificationToAllAdmins({
        subject,
        message,
        type = MailNotificationTypeEnum.EXITING
    }: { subject: string, message: string, type: string }) {
        try {
            const users = await this.userService.checkUserByRoles([UserRole.ADMINISTRATOR, UserRole.SYSTEM_ADMINISTRATOR]);
            let mails = users.map(user => user.email);

            let html: string = ""
            if (type == MailNotificationTypeEnum.EXITING) {
                html = notificationExitingTemplate(message)
            } else if (type == MailNotificationTypeEnum.WARNING) {
                html = notificationWarningTemplate(message)
            } else if (type == MailNotificationTypeEnum.ERROR) {
                html = notificationErrorTemplate(message)
            } else if (type == MailNotificationTypeEnum.SUCCESS) {
                html = notificationSuccessTemplate(message)
            } else if (type == MailNotificationTypeEnum.INFO) {
                html = notificationInfoTemplate(message)
            } else {
                html = message
            }

            let mailsPromise = mails.map(mail => this.mailService.sendMail({
                to: mail,
                subject: subject,
                html
            }));
            let result = await Promise.all(mailsPromise);
            return result;
        } catch (err) {
            throw new Error(err);
        }
    }
}