import { Module, forwardRef } from '@nestjs/common';
import { OrderModule } from 'src/order/order.module';
import { UserModule } from 'src/user/user.module';
import { BinanceService } from './service/binance.service';

@Module({
    imports: [OrderModule, forwardRef(() => UserModule)],
    controllers: [],
    providers: [BinanceService],
    exports: [BinanceService],
})
export class BinanceModule { }
