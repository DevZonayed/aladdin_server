import { MailerService } from '@nestjs-modules/mailer';
import { UserService } from 'src/user/service/user.service';
export declare class NotificationService {
    private readonly mailService;
    private readonly userService;
    constructor(mailService: MailerService, userService: UserService);
    sendNotificationToAllAdmins({ subject, message, type }: {
        subject: string;
        message: string;
        type: string;
    }): Promise<any[]>;
}
