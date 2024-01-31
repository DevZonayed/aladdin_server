"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSuccessNotificationToAdmins = exports.sendWarnNotificationToAdmins = exports.sendInfoNotificationToAdmins = exports.sendErrorNotificationToAdmins = void 0;
const mail_type_enum_1 = require("../../../notification/mail/enum/mail.type.enum");
async function sendErrorNotificationToAdmins(mailNotificationService, message) {
    await mailNotificationService.sendNotificationToAllAdmins({
        subject: "Critical Error !❌❌",
        message: `${message}`,
        type: mail_type_enum_1.MailNotificationTypeEnum.ERROR,
    });
}
exports.sendErrorNotificationToAdmins = sendErrorNotificationToAdmins;
async function sendInfoNotificationToAdmins(mailNotificationService, message) {
    await mailNotificationService.sendNotificationToAllAdmins({
        subject: "Alaadin Information",
        message: `${message}`,
        type: mail_type_enum_1.MailNotificationTypeEnum.INFO,
    });
}
exports.sendInfoNotificationToAdmins = sendInfoNotificationToAdmins;
async function sendWarnNotificationToAdmins(mailNotificationService, message) {
    await mailNotificationService.sendNotificationToAllAdmins({
        subject: "Alaadin Warning",
        message: `${message}`,
        type: mail_type_enum_1.MailNotificationTypeEnum.WARNING,
    });
}
exports.sendWarnNotificationToAdmins = sendWarnNotificationToAdmins;
async function sendSuccessNotificationToAdmins(mailNotificationService, message) {
    await mailNotificationService.sendNotificationToAllAdmins({
        subject: "Alaadin Info Success",
        message: `${message}`,
        type: mail_type_enum_1.MailNotificationTypeEnum.WARNING,
    });
}
exports.sendSuccessNotificationToAdmins = sendSuccessNotificationToAdmins;
//# sourceMappingURL=botMail.utils.js.map