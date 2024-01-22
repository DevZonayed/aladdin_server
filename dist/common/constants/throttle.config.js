"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getThroTTLconfig = void 0;
const core_service_1 = require("../config/core/core.service");
const config = new core_service_1.CoreConfigService();
function getThroTTLconfig() {
    const formattedConfig = [
        {
            name: config.get(core_service_1.THROTTLER_SHORT_NAME),
            ttl: Number(config.get(core_service_1.THROTTLER_SHORT_TTL)),
            limit: Number(config.get(core_service_1.THROTTLER_SHORT_LIMIT)),
        },
        {
            name: config.get(core_service_1.THROTTLER_MEDIUM_NAME),
            ttl: Number(config.get(core_service_1.THROTTLER_MEDIUM_TTL)),
            limit: Number(config.get(core_service_1.THROTTLER_MEDIUM_LIMIT)),
        },
        {
            name: config.get(core_service_1.THROTTLER_LONG_NAME),
            ttl: Number(config.get(core_service_1.THROTTLER_LONG_TTL)),
            limit: Number(config.get(core_service_1.THROTTLER_LONG_LIMIT)),
        },
    ];
    return formattedConfig;
}
exports.getThroTTLconfig = getThroTTLconfig;
//# sourceMappingURL=throttle.config.js.map