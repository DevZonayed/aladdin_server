class WorkerManager {
    workers: any[] = [];
    constructor(initialworkers = []) {
        this.workers = initialworkers;
    }

    getWorker(identifier) {
        return this.workers.filter(worker =>
            worker.strName === identifier || worker.id === identifier)[0];
    }

    getWorkers(identifier) {
        return this.workers.filter(worker =>
            worker.strName === identifier || worker.id === identifier);
    }


    addWorker(newWorker) {
        this.workers.push(newWorker);
    }

    updateWorker(workerId, keyName, value) {
        const worker = this.getWorker(workerId)
        if (worker) {
            worker.updateProperty(keyName, value)
        }
    }

    deleteWorker(workerId) {
        const worker = this.getWorker(workerId)
        worker.stopWorker()
        this.workers = this.workers.filter(worker => worker.id !== workerId);
    }

    startWorker(workerId) {
        const worker = this.getWorker(workerId);
        if (worker) {
            worker.startWorker()
        }
    }

    stopWorker(workerId) {
        const worker = this.getWorker(workerId);
        if (worker) {
            worker.stopWorker()
        }
    }
}

const WorkerManagerInstance = new WorkerManager();

export { WorkerManager, WorkerManagerInstance };
