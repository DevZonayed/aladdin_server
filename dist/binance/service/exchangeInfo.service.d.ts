import { Cache } from "cache-manager";
import BinanceType from "node-binance-api";
interface SymbolInfo {
    symbol: string;
    filters: Array<{
        filterType: string;
        stepSize?: string;
        tickSize?: string;
    }>;
}
interface ExchangeInfo {
    symbols: SymbolInfo[];
}
export declare class BinanceExchaneService {
    binanceInstance: BinanceType;
    cacheService: Cache;
    binanceExchangeInfoKey: string;
    cacheTTL: number;
    constructor(cacheService: Cache);
    getExchangeInfo(): Promise<ExchangeInfo>;
    getPrecisionFromFilter(filters: any, filterType: any): number;
    formatQuantity(symbol: string, quantity: number): Promise<number>;
    formatPrice(symbol: string, price: any): Promise<number>;
}
export {};
