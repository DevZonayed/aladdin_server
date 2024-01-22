import { Injectable } from '@nestjs/common';
import {
  HealthCheckService,
  HttpHealthIndicator,
  MongooseHealthIndicator,
} from '@nestjs/terminus';

@Injectable()
export class AppService {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private mongooseHealth: MongooseHealthIndicator,
  ) {}

  async getHealthStatus(): Promise<any> {
    const healthCheckResult = await this.health.check([
      () => this.http.pingCheck('Rikoul Server Docs', 'http://localhost'),
      () => this.mongooseHealth.pingCheck('mongodb'),
    ]);
    return healthCheckResult;
  }
}
