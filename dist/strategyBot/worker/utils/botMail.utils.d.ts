import { NotificationService } from "src/notification/mail/service/notification.service";
export declare function sendErrorNotificationToAdmins(mailNotificationService: NotificationService, message: string): Promise<void>;
export declare function sendInfoNotificationToAdmins(mailNotificationService: NotificationService, message: string): Promise<void>;
export declare function sendWarnNotificationToAdmins(mailNotificationService: NotificationService, message: string): Promise<void>;
export declare function sendSuccessNotificationToAdmins(mailNotificationService: NotificationService, message: string): Promise<void>;
