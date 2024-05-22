import { MailerModule } from '@nestjs-modules/mailer';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { TerminusModule } from '@nestjs/terminus';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BinanceModule } from './binance/binance.module';
import { CoreConfigModule } from './common/config/core/core.module';
import { getDefaultMailConnectionConfig } from './common/constants/mail.connection';
import { getDefaultDbConnectionString } from './common/constants/mongoose.connection';
import { getThroTTLconfig } from './common/constants/throttle.config';
import { httpConfig } from './common/module/http/http-config';
import { NotificationModule } from './notification/mail/notification.module';
import { StrategyModule } from './strategy/strategy.module';
import { BotModule } from './strategyBot/bot.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TerminusModule,
    HttpModule.register(httpConfig),
    MongooseModule.forRoot(getDefaultDbConnectionString()),
    MailerModule.forRoot(getDefaultMailConnectionConfig()),
    ThrottlerModule.forRoot(getThroTTLconfig()),
    CacheModule.register({ isGlobal: true, ttl: 43200000 }),
    CoreConfigModule,
    AuthModule,
    UserModule,
    JwtModule,
    BinanceModule,
    StrategyModule,
    BotModule,
    // BinanceBotModule,
    NotificationModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
