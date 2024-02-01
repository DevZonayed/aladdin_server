export declare function calculateParentTradePercentage(capital: number, quantity: number, entryPrice: number): number;
export declare function calculateTradeDetailsForUser(capital: number, percentage: number, entryPrice: number): number[];
export declare function calculateQuantity(amount: number, entryPrice: number): number;
export declare function calculateMyTradeAmount(traderTradeAmount: any, traderBalance: any, myBalance: any, myMaxTrade?: number, persistentRatio?: any): {
    tradeAmount: number;
    ratio: any;
};
export declare function calculatePercentage(amount: any, percentage: any): number;
