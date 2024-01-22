import { Module } from '@nestjs/common';
import { AuthModule } from '../auth.module';
import { AppleAuthController } from './appleAuth.controller';
import { AppleAuthService } from './appleAuth.service';

@Module({
  imports: [AuthModule],
  controllers: [AppleAuthController],
  providers: [AppleAuthService],
})
export class AppleAuthModule {}
