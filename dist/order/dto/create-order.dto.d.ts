export declare class CreateOrderDto {
    readonly orderBy: string;
    readonly bucketName: string;
    readonly restaurant: string;
    readonly qty: number;
    readonly amount: number;
    readonly paymentAccountType: string;
    readonly paymentStatus: string;
    readonly orderStatus: string;
    readonly isRefundable: boolean;
    readonly transactionID: string;
}
