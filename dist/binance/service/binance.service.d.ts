import BinanceType from 'node-binance-api';
export declare class BinanceService {
    checkBalance(apiKey: string, secretKey: string): Promise<any>;
    binanceApiHandler(apiKey: string, secretKey: string, action: (binance: BinanceType) => Promise<any>): Promise<any>;
}
