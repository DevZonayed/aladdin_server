import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BinanceBotController } from './controller/binance-bot.controller';
import { BinanceBot, BinanceBotSchema } from './entities/binance-bot.entity';
import { BinanceBotService } from './service/binance-bot.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: BinanceBot.name, schema: BinanceBotSchema },
        ]),
    ],
    controllers: [BinanceBotController],
    providers: [BinanceBotService],
})
export class BinanceBotModule { }
