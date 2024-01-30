import { Module } from '@nestjs/common';
import { StrategyModule } from 'src/strategy/strategy.module';
import { WorkerService } from './service/worker.service';

@Module({
    imports: [StrategyModule,],
    controllers: [],
    providers: [WorkerService],
    exports: [WorkerService]
})
export class WorkerModule { }
