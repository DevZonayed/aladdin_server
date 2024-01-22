"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultMailConnectionConfig = void 0;
const core_service_1 = require("../config/core/core.service");
const config = new core_service_1.CoreConfigService();
function getDefaultMailConnectionConfig() {
    return {
        transport: {
            host: config.get(core_service_1.MAIL_HOST),
            port: config.get(core_service_1.MAIL_PORT),
            ignoreTLS: config.get(core_service_1.MAIL_IGNORE_TLS),
            secure: config.get(core_service_1.MAIL_SECURE),
            auth: {
                user: config.get(core_service_1.MAIL_USER),
                pass: config.get(core_service_1.MAIL_PASSWORD),
            },
        },
        defaults: {
            from: `${config.get(core_service_1.MAIL_SENDER_NAME)} <${config.get(core_service_1.MAIL_USER)}>`,
        },
    };
}
exports.getDefaultMailConnectionConfig = getDefaultMailConnectionConfig;
//# sourceMappingURL=mail.connection.js.map