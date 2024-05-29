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
    async formatQuantity(symbol, quantity, respectNotion = false) {
        const exchangeInfo = await this.getExchangeInfo();
        const symbolInfo = exchangeInfo.symbols.find(s => s.symbol === symbol);
        if (!symbolInfo)
            throw new Error("Symbol not found in exchange info");
        const price = await this.getCurrentPrice(symbol);
        const notionalFilter = symbolInfo.filters.find(f => f.filterType === 'MIN_NOTIONAL');
        if (!notionalFilter || !notionalFilter.notional)
            throw new Error("MIN_NOTIONAL filter not found for symbol");
        const minNotionalValue = parseFloat(notionalFilter.notional);
        let notionalValue = quantity * price;
        if (notionalValue < minNotionalValue && respectNotion) {
            quantity = minNotionalValue / price;
        }
        else if (notionalValue < minNotionalValue) {
            throw new Error("Notional value not satisfied. Enable respectNotion or increase quantity.");
        }
        const lotSizeFilter = symbolInfo.filters.find(f => f.filterType === 'LOT_SIZE');
        if (!lotSizeFilter)
            throw new Error("LOT_SIZE filter not found for symbol");
        const stepSize = parseFloat(lotSizeFilter.stepSize);
        const precision = this.getPrecisionFromFilter(symbolInfo.filters, 'LOT_SIZE');
        quantity = Math.max(Math.ceil(quantity / stepSize) * stepSize, stepSize);
        notionalValue = quantity * price;
        if (notionalValue < minNotionalValue) {
            quantity = ((minNotionalValue / price) / stepSize) * stepSize;
        }
        return parseFloat(quantity.toFixed(precision));
    }
    async getCurrentPrice(symbol) {
        try {
            const ticker = await this.binanceInstance.futuresPrices();
            const symbolPrice = ticker[symbol];
            if (!symbolPrice) {
                throw new Error(`Failed to fetch current price for symbol ${symbol}`);
            }
            return parseFloat(symbolPrice);
        }
        catch (err) {
            throw new Error(`Failed to fetch current price for symbol from binance : ${err.message}`);
        }
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