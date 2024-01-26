// export const BINANCE_MODE = "dev"
export const BINANCE_MODE: string = "prod"
export const IS_BINANCE_TEST_MODE: boolean = true
export const PROXY_SERVER_URL = 'https://aladdinai.io';
export const BINANCE_BASE_URL = 'https://api.binance.com';
export const BINANCE_TEST_BASE_URL = 'https://testnet.binance.vision';
export const BINANCE_SPOT_BASE_API_URL = BINANCE_BASE_URL + '/api';
export const BINANCE_TEST_BASE_API_URL = BINANCE_TEST_BASE_URL + '/api';

export const BINANCE_FUTURE_BASE_URL = "https://fapi.binance.com"
export const BINANCE_FUTURE_BASE_URL_WITH_PROXY = PROXY_SERVER_URL + "/?url=" + "https://fapi.binance.com"