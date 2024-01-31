"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BinanceExchaneService = void 0;
const Binance = require("node-binance-api");
class BinanceExchaneService {
    constructor(cacheService) {
        this.binanceExchangeInfoKey = "BINANCE_EXCHANGE_INFO";
        this.cacheTTL = 300;
        this.binanceInstance = new Binance();
        this.cacheService = cacheService;
    }
    async getExchangeInfo() {
        try {
            let exchangeInfo = await this.cacheService.get(this.binanceExchangeInfoKey);
            if (exchangeInfo) {
                return exchangeInfo;
            }
            exchangeInfo = await this.binanceInstance.futuresExchangeInfo();
            await this.cacheService.set(this.binanceExchangeInfoKey, exchangeInfo, this.cacheTTL);
            return exchangeInfo;
        }
        catch (err) {
            console.error(err);
            throw new Error("Exchange Info Getting Error");
        }
    }
    getPrecisionFromFilter(filters, filterType) {
        const filter = filters.find(f => f.filterType === filterType);
        if (!filter) {
            return 0;
        }
        const stepSize = filterType === 'LOT_SIZE' ? filter.stepSize : filter.tickSize;
        const precision = stepSize.indexOf('1') - 1;
        return Math.max(0, precision);
    }
    async formatQuantity(symbol, quantity) {
        const exchangeInfo = await this.getExchangeInfo();
        const symbolInfo = exchangeInfo.symbols.find(s => s.symbol === symbol);
        if (!symbolInfo) {
            throw new Error("Symbol not found in exchange info");
        }
        const precision = this.getPrecisionFromFilter(symbolInfo.filters, 'LOT_SIZE');
        return parseFloat(quantity.toFixed(precision));
    }
    async formatPrice(symbol, price) {
        price = parseFloat(price);
        const exchangeInfo = await this.getExchangeInfo();
        const symbolInfo = exchangeInfo.symbols.find(s => s.symbol === symbol);
        if (!symbolInfo) {
            throw new Error("Symbol not found in exchange info");
        }
        const precision = this.getPrecisionFromFilter(symbolInfo.filters, 'PRICE_FILTER');
        return parseFloat(price.toFixed(precision));
    }
}
exports.BinanceExchaneService = BinanceExchaneService;
//# sourceMappingURL=exchangeInfo.service.js.map