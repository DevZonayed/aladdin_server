import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BinanceModule } from 'src/binance/binance.module';
import { StrategyModule } from 'src/strategy/strategy.module';
import { UserModule } from 'src/user/user.module';
import { BotController } from './controller/bot.controller';
import { BotSchema } from './entities/bot.entity';
import { BotService } from './service/bot.service';
import { WorkerModule } from './worker/worker.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Bot', schema: BotSchema },
    ]),
    UserModule,
    BinanceModule,
    WorkerModule,
    StrategyModule
  ],
  controllers: [BotController],
  providers: [BotService],
})
export class BotModule { }
