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
exports.NotificationService = void 0;
const mailer_1 = require("@nestjs-modules/mailer");
const common_1 = require("@nestjs/common");
const enum_1 = require("../../../common/enum");
const user_service_1 = require("../../../user/service/user.service");
const mail_type_enum_1 = require("../enum/mail.type.enum");
const notification_template_1 = require("../templates/notification.template");
let NotificationService = class NotificationService {
    constructor(mailService, userService) {
        this.mailService = mailService;
        this.userService = userService;
    }
    async sendNotificationToAllAdmins({ subject, message, type = mail_type_enum_1.MailNotificationTypeEnum.EXITING }) {
        try {
            const users = await this.userService.checkUserByRoles([enum_1.UserRole.ADMINISTRATOR, enum_1.UserRole.SYSTEM_ADMINISTRATOR]);
            let mails = users.map(user => user.email);
            let html = "";
            if (type == mail_type_enum_1.MailNotificationTypeEnum.EXITING) {
                html = (0, notification_template_1.notificationExitingTemplate)(message);
            }
            else if (type == mail_type_enum_1.MailNotificationTypeEnum.WARNING) {
                html = (0, notification_template_1.notificationWarningTemplate)(message);
            }
            else if (type == mail_type_enum_1.MailNotificationTypeEnum.ERROR) {
                html = (0, notification_template_1.notificationErrorTemplate)(message);
            }
            else if (type == mail_type_enum_1.MailNotificationTypeEnum.SUCCESS) {
                html = (0, notification_template_1.notificationSuccessTemplate)(message);
            }
            else if (type == mail_type_enum_1.MailNotificationTypeEnum.INFO) {
                html = (0, notification_template_1.notificationInfoTemplate)(message);
            }
            else {
                html = message;
            }
            let mailsPromise = mails.map(mail => this.mailService.sendMail({
                to: mail,
                subject: subject,
                html
            }));
            let result = await Promise.all(mailsPromise);
            return result;
        }
        catch (err) {
            throw new Error(err);
        }
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => user_service_1.UserService))),
    __metadata("design:paramtypes", [mailer_1.MailerService,
        user_service_1.UserService])
], NotificationService);
//# sourceMappingURL=notification.service.js.map