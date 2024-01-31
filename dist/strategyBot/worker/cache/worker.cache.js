"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkerManagerInstance = exports.WorkerManager = void 0;
class WorkerManager {
    constructor(initialworkers = []) {
        this.workers = [];
        this.workers = initialworkers;
    }
    getWorker(identifier) {
        let result = this.workers.filter(worker => worker.strName === identifier || worker.id === identifier)[0];
        return result;
    }
    getWorkers(identifier) {
        return this.workers.filter(worker => worker.strName === identifier || worker.id === identifier);
    }
    addWorker(newWorker) {
        this.workers.push(newWorker);
    }
    updateWorker(workerId, keyName, value) {
        const worker = this.getWorker(workerId);
        if (worker) {
            worker.updateProperty(keyName, value);
        }
    }
    deleteWorker(workerId) {
        const worker = this.getWorker(workerId);
        worker.stopWorker();
        this.workers = this.workers.filter(worker => worker.id !== workerId);
    }
    startWorker(workerId) {
        const worker = this.getWorker(workerId);
        if (worker) {
            worker.startWorker();
        }
    }
    stopWorker(workerId) {
        const worker = this.getWorker(workerId);
        if (worker) {
            worker.stopWorker();
        }
    }
}
exports.WorkerManager = WorkerManager;
const WorkerManagerInstance = new WorkerManager();
exports.WorkerManagerInstance = WorkerManagerInstance;
//# sourceMappingURL=worker.cache.js.map