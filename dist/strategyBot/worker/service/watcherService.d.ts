export declare class DataWatcher {
    previousData: any[];
    callbacks: {
        newOrder: any;
        removedOrder: any;
        updatedOrder: any;
        unUsualActivity: any;
    };
    unUsualDetected: any;
    dataUpdateTime: any;
    constructor();
    on(event: any, callback: any): void;
    updateData(newData: any): void;
    detectChanges(newData: any): boolean;
    isUnusualActivityDetected(newData: any): boolean;
    detectNewAndRemovedOrders(newData: any, newIds: any, oldIds: any): void;
    detectUpdatedOrders(newData: any): void;
    runningOrders(): any[];
    isEqual(obj1: any, obj2: any): boolean;
    triggerEvent(event: any, ...args: any[]): void;
}
