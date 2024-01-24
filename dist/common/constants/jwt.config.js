"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultJwtConfig = void 0;
const core_service_1 = require("../config/core/core.service");
const config = new core_service_1.CoreConfigService();
function getDefaultJwtConfig() {
    return {
        global: true,
        secret: config.get(core_service_1.JWT_SECRECT_KEY),
        signOptions: { expiresIn: config.get(core_service_1.JWT_EXPIRES_IN) },
    };
}
exports.getDefaultJwtConfig = getDefaultJwtConfig;
//# sourceMappingURL=jwt.config.js.map