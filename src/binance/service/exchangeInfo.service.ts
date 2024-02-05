import { Cache } from "cache-manager";
import BinanceType from "node-binance-api";
const Binance = require("node-binance-api");

// Define a type for the symbol information
interface SymbolInfo {
    symbol: string;
    filters: Array<{
        filterType: string;
        minNotional?: string;
        maxNotional?: string;
        stepSize?: string;
        tickSize?: string;
    }>;
}

// Define a type for the exchange information
interface ExchangeInfo {
    symbols: SymbolInfo[];
}

export class BinanceExchaneService {
    binanceInstance: BinanceType;
    cacheService: Cache;
    binanceExchangeInfoKey = "BINANCE_EXCHANGE_INFO";
    cacheTTL = 300;

    constructor(cacheService: Cache) {
        this.binanceInstance = new Binance();
        this.cacheService = cacheService;
    }

    async getExchangeInfo(): Promise<ExchangeInfo> {
        try {
            let exchangeInfo = await this.cacheService.get<ExchangeInfo>(this.binanceExchangeInfoKey);
            if (exchangeInfo) {
                return exchangeInfo;
            }
            exchangeInfo = await this.binanceInstance.futuresExchangeInfo();
            await this.cacheService.set(this.binanceExchangeInfoKey, exchangeInfo, this.cacheTTL);
            return exchangeInfo;
        } catch (err) {
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

    async formatQuantity(symbol: string, quantity: number, respectNotion: boolean = false): Promise<number> {
        const exchangeInfo = await this.getExchangeInfo();
        const symbolInfo = exchangeInfo.symbols.find(s => s.symbol === symbol);
        if (!symbolInfo) {
            throw new Error("Symbol not found in exchange info");
        }

        // Fetch current price for the symbol
        const price = await this.getCurrentPrice(symbol);

        // Find MIN_NOTIONAL filter
        const minNotionalFilter = symbolInfo.filters.find(f => f.filterType === 'NOTIONAL');
        if (!minNotionalFilter || !minNotionalFilter.minNotional || !minNotionalFilter.maxNotional) {
            throw new Error("NOTIONAL filter not found for symbol");
        }

        const minNotionalValue = parseFloat(minNotionalFilter.minNotional);
        const maxNotionalValue = parseFloat(minNotionalFilter.maxNotional);
        let notionalValue = quantity * price;

        if (notionalValue < minNotionalValue && respectNotion) {
            quantity = minNotionalValue / price;
            notionalValue = quantity * price;
        } else if (notionalValue > maxNotionalValue && respectNotion) {
            quantity = maxNotionalValue / price;
            notionalValue = quantity * price;
        }

        const precision = this.getPrecisionFromFilter(symbolInfo.filters, 'LOT_SIZE');
        return parseFloat(quantity.toFixed(precision));
    }

    async getCurrentPrice(symbol: string): Promise<number> {
        try {
            const ticker = await this.binanceInstance.prices(symbol);
            return parseFloat(ticker[symbol]);
        } catch (err) {
            console.error(err);
            throw new Error("Failed to fetch current price for symbol");
        }
    }

    async formatPrice(symbol: string, price: any): Promise<number> {
        price = parseFloat(price)
        const exchangeInfo = await this.getExchangeInfo();
        const symbolInfo = exchangeInfo.symbols.find(s => s.symbol === symbol);
        if (!symbolInfo) {
            throw new Error("Symbol not found in exchange info");
        }
        const precision = this.getPrecisionFromFilter(symbolInfo.filters, 'PRICE_FILTER');
        return parseFloat(price.toFixed(precision));
    }
}