export declare function computeClosedOrderQuantity(order: any, orderDto: any): any;
export declare function computeOrderTotalQuantity(order: any, orderDto: any): number;
export declare function computeAllOrderOrderQuantity(orders: any): any;
export declare function identifyOrdersForCancellation(orders: any, targetQty: number, targetSide: String): any[];
export declare function generateFutureOrdersResponse(userId: any, data: any, orderDto: any, strategy: any, isSuccess: any, ratio?: any): {
    userId: any;
    orderDto: any;
    strategy: any;
    success: boolean;
    message: any;
    ratio?: undefined;
    order?: undefined;
} | {
    userId: any;
    orderDto: any;
    strategy: any;
    ratio: any;
    order: any;
    success: boolean;
    message?: undefined;
};
export declare function safePromiseBuild(apiCall: any, identifier?: string): Promise<any>;
export declare function retrieveDataFromOrderResult(result: any): {
    userId: any;
    orderDto: any;
    success: any;
    message: any;
    order: any;
    ratio: any;
    strategy: any;
};
export declare function buildNewOrderPayload(success: any, userId: any, strategy: any, orderDto: any, order: any, ratio: any, message: any): any;
export declare function computeOrderUpdateDetails(orderData: any, orderDto: any, order: any): {};
