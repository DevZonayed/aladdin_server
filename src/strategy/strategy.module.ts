import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'src/user/user.module';
import { StrategyController } from './controller/strategy.controller';
import { StrategySchema } from './entities/strategy.entity';
import { StrategyService } from './service/strategy.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Strategy', schema: StrategySchema },
    ]),
    UserModule,
  ],
  controllers: [StrategyController],
  providers: [StrategyService],
})
export class StrategyModule { }
