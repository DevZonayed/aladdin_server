"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataWatcher = void 0;
class DataWatcher {
    constructor() {
        this.previousData = [];
        this.callbacks = {
            newOrder: null,
            removedOrder: null,
            updatedOrder: null,
            unUsualActivity: null,
        };
        this.unUsualDetected = null;
        this.dataUpdateTime = null;
    }
    on(event, callback) {
        if (event in this.callbacks) {
            this.callbacks[event] = callback;
        }
        else {
            throw new Error(`No such event: ${event}`);
        }
    }
    updateData(newData) {
        if (this.detectChanges(newData)) {
            this.previousData = newData;
            this.dataUpdateTime = Date.now();
        }
    }
    detectChanges(newData) {
        if (this.isUnusualActivityDetected(newData))
            return false;
        const newIds = new Set(newData.map(item => item.id));
        const oldIds = new Set(this.previousData.map(item => item.id));
        if (this.dataUpdateTime) {
            this.detectNewAndRemovedOrders(newData, newIds, oldIds);
        }
        this.detectUpdatedOrders(newData);
        return true;
    }
    isUnusualActivityDetected(newData) {
        if (this.previousData.length > 1 && newData.length == 0 && this.unUsualDetected == null) {
            this.triggerEvent('unUsualActivity', { issue: "no_new_data" });
            this.unUsualDetected = true;
            return true;
        }
        this.unUsualDetected = null;
        return false;
    }
    detectNewAndRemovedOrders(newData, newIds, oldIds) {
        newData.forEach(item => {
            if (!oldIds.has(item.id)) {
                this.triggerEvent('newOrder', item);
            }
        });
        this.previousData.forEach(item => {
            if (!newIds.has(item.id)) {
                this.triggerEvent('removedOrder', item);
            }
        });
    }
    detectUpdatedOrders(newData) {
        newData.forEach(newItem => {
            const oldItem = this.previousData.find(item => item.id === newItem.id);
            if (oldItem && !this.isEqual(oldItem, newItem)) {
                this.triggerEvent('updatedOrder', oldItem, newItem);
            }
        });
    }
    isEqual(obj1, obj2) {
        return Object.keys(obj1).every(key => obj1[key] === obj2[key]);
    }
    triggerEvent(event, ...args) {
        if (typeof this.callbacks[event] === 'function') {
            this.callbacks[event](...args);
        }
    }
}
exports.DataWatcher = DataWatcher;
//# sourceMappingURL=watcherService.js.map