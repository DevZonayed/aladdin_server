"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApiResponse = void 0;
const createApiResponse = (statusCode, response, message, payload = []) => ({
    statusCode: statusCode,
    response: response,
    message: message,
    payload: payload,
});
exports.createApiResponse = createApiResponse;
//# sourceMappingURL=create-api.response.js.map