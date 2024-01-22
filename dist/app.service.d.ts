import { HealthCheckService, HttpHealthIndicator, MongooseHealthIndicator } from '@nestjs/terminus';
export declare class AppService {
    private health;
    private http;
    private mongooseHealth;
    constructor(health: HealthCheckService, http: HttpHealthIndicator, mongooseHealth: MongooseHealthIndicator);
    getHealthStatus(): Promise<any>;
}
