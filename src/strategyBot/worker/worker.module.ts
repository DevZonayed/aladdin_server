import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StrategyModule } from 'src/strategy/strategy.module';
import { BotSchema } from '../entities/bot.entity';
import { WorkerService } from './service/worker.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Bot', schema: BotSchema }]),
        StrategyModule],
    controllers: [],
    providers: [WorkerService],
    exports: [WorkerService]
})
export class WorkerModule { }
