import { BinanceBot } from "../entities/binance-bot.entity";
export declare class BinanceBotConnection {
    private apiKey;
    private apiSecret;
    private strategy;
    private readonly binanceListenKeyHook;
    private listenKey;
    private status;
    private ws;
    constructor(apiKey: string, apiSecret: string, strategy: BinanceBot);
    getListenKey(): Promise<void>;
    start(): Promise<void>;
    handleAccountOrder(listenKey: string): void;
    stop(): Promise<void>;
    getStatus(): boolean;
    getName(): string;
    private handleMessage;
}
