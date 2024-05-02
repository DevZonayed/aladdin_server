import { MaxPosition } from '../interfaces/max_position.interface';
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
    readonly respectNotion: boolean;
    readonly tradeMaxLeverage: number;
    readonly tradeMaxAmountPercentage: number;
    readonly maxReEntry: number;
    readonly reEntry: boolean;
    readonly stopLoss: boolean;
    readonly stopNewOrder: boolean;
    readonly prefaredSignalType: string;
    readonly maxPosition: MaxPosition;
    readonly maxLongEntry: number;
    readonly maxShortEntry: number;
    readonly stopLossPercentage: number;
    readonly createdBy: string;
}
