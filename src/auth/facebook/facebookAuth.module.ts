import { Module } from '@nestjs/common';
import { AuthModule } from '../auth.module';
import { FacebookAuthController } from './facebookAuth.controller';
import { FacebookAuthService } from './facebookAuth.service';

@Module({
  imports: [AuthModule],
  controllers: [FacebookAuthController],
  providers: [FacebookAuthService],
})
export class FacebookAuthModule {}
