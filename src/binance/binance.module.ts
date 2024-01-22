import { Global, Module } from '@nestjs/common';
import { BinanceService } from './service/binance.service';

@Global()
@Module({
    imports: [],
    controllers: [],
    providers: [BinanceService],
    exports: [BinanceService],
})
export class BinanceModule { }
