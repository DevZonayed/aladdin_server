import { MailerModule } from '@nestjs-modules/mailer';
import { HttpModule } from '@nestjs/axios';
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
import { StrategyModule } from './strategy/strategy.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TerminusModule,
    HttpModule.register(httpConfig),
    MongooseModule.forRoot(getDefaultDbConnectionString()),
    MailerModule.forRoot(getDefaultMailConnectionConfig()),
    ThrottlerModule.forRoot(getThroTTLconfig()),
    CoreConfigModule,
    BinanceModule,
    AuthModule,
    UserModule,
    JwtModule,
    StrategyModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
