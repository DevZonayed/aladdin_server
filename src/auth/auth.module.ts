import { Module, forwardRef } from '@nestjs/common';
import { JWTAuthModule } from '../common/module/jwt/jwt.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';

@Module({
  imports: [JWTAuthModule, forwardRef(() => UserModule)],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule { }
