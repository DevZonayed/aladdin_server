export declare class CreateStrategyDto {
    readonly StrategyName: string;
    readonly description: string;
    readonly bannedAssets: string[];
    readonly allowAssets: string[];
    readonly apiSlug: string;
    readonly capital: number;
    readonly isolated: number;
    readonly newOrderType: string;
    readonly partialOrderType: string;
    readonly minimumCapitalToSubscribe: number;
    readonly tradeMaxAmountPercentage: number;
    readonly respectNotion: boolean;
    readonly tradeMaxLeverage: number;
    readonly reEntry: boolean;
    readonly stopLoss: boolean;
    readonly stopLossPercentage: number;
    readonly createdBy: string;
}
