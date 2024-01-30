declare class WorkerManager {
    workers: any[];
    constructor(initialworkers?: any[]);
    getWorker(identifier: any): any;
    getWorkers(identifier: any): any[];
    addWorker(newWorker: any): void;
    updateWorker(workerId: any, keyName: any, value: any): void;
    deleteWorker(workerId: any): void;
    startWorker(workerId: any): void;
    stopWorker(workerId: any): void;
}
declare const WorkerManagerInstance: WorkerManager;
export { WorkerManager, WorkerManagerInstance };
