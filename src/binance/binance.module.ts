import { Module, forwardRef } from '@nestjs/common';
import { NotificationModule } from 'src/notification/mail/notification.module';
import { OrderModule } from 'src/order/order.module';
import { StrategyModule } from 'src/strategy/strategy.module';
import { UserModule } from 'src/user/user.module';
import { BinanceService } from './service/binance.service';

@Module({
    imports: [OrderModule, forwardRef(() => UserModule), forwardRef(() => StrategyModule), forwardRef(() => NotificationModule)],
    // imports: [OrderModule, forwardRef(() => UserModule), NotificationModule],
    controllers: [],
    providers: [BinanceService],
    exports: [BinanceService],
})
export class BinanceModule { }
