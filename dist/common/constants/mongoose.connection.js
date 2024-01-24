"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultDbConnectionString = void 0;
const core_service_1 = require("../config/core/core.service");
const config = new core_service_1.CoreConfigService();
function getDefaultDbConnectionString() {
    const mongoUriPrefix = config.get(core_service_1.MONGO_URI_PREFIX) || 'mongodb';
    const mongoOptions = {};
    const formattedOptions = Object.entries(mongoOptions)
        .map(([key, value]) => `${key}=${value}`)
        .join('&');
    let authPart = '';
    const user = config.get(core_service_1.DB_USER);
    const password = config.get(core_service_1.DB_PASSWORD);
    if (user && password) {
        authPart = `${user}:${password}@`;
    }
    let hostPart = config.get(core_service_1.DB_HOST) || 'localhost';
    let portPart = config.get(core_service_1.DB_PORT);
    if (portPart) {
        portPart = `:${portPart}`;
    }
    else {
        portPart = '';
    }
    const dbName = config.get(core_service_1.DB_NAME) || 'test';
    const connectionString = `${mongoUriPrefix}://${authPart}${hostPart}${portPart}/${dbName}?${formattedOptions}`;
    console.log(connectionString);
    return connectionString;
}
exports.getDefaultDbConnectionString = getDefaultDbConnectionString;
//# sourceMappingURL=mongoose.connection.js.map