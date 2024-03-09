import { StatusEnum } from '../enums/status.enum';
export declare class CreateOrderDto {
    readonly symbol: string;
    readonly side: string;
    readonly type: string;
    readonly quantity: number;
    readonly price: number;
    readonly leverage: number;
    readonly initialOrderRatio: number;
    readonly isolated: boolean;
    readonly reEntryCount: number;
    readonly status: StatusEnum;
    readonly closeReason: string;
}
