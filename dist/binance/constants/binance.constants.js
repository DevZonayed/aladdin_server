"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BINANCE_FUTURE_BASE_URL_WITH_PROXY = exports.BINANCE_FUTURE_BASE_URL = exports.BINANCE_TEST_BASE_API_URL = exports.BINANCE_SPOT_BASE_API_URL = exports.BINANCE_TEST_BASE_URL = exports.BINANCE_BASE_URL = exports.PROXY_SERVER_URL = exports.IS_BINANCE_TEST_MODE = exports.BINANCE_MODE = void 0;
exports.BINANCE_MODE = "prod";
exports.IS_BINANCE_TEST_MODE = true;
exports.PROXY_SERVER_URL = 'https://aladdinai.io';
exports.BINANCE_BASE_URL = 'https://api.binance.com';
exports.BINANCE_TEST_BASE_URL = 'https://testnet.binance.vision';
exports.BINANCE_SPOT_BASE_API_URL = exports.BINANCE_BASE_URL + '/api';
exports.BINANCE_TEST_BASE_API_URL = exports.BINANCE_TEST_BASE_URL + '/api';
exports.BINANCE_FUTURE_BASE_URL = "https://fapi.binance.com";
exports.BINANCE_FUTURE_BASE_URL_WITH_PROXY = exports.PROXY_SERVER_URL + "/?url=" + "https://fapi.binance.com";
//# sourceMappingURL=binance.constants.js.map