export declare class OrderWebHookDto {
    readonly copyOrderId: string;
    readonly symbol: string;
    readonly side: string;
    readonly type: string;
    readonly quantity: number;
    readonly price: number;
    readonly leverage: number;
    readonly isolated: boolean;
}
