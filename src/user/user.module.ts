import { Global, Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BinanceModule } from 'src/binance/binance.module';
import { UserProfileImageUploadModule } from '../common/module';
import { UserController } from './controller/user.controller';
import { UserSchema } from './entities/user.entity';
import { UserService } from './service/user.service';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    UserProfileImageUploadModule,
    forwardRef(() => BinanceModule)
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule { }
