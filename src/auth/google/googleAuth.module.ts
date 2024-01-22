import { Module } from '@nestjs/common';
import { AuthModule } from '../auth.module';
import { GoogleAuthController } from './googleAuth.controller';
import { GoogleAuthService } from './googleAuth.service';

@Module({
  imports: [AuthModule],
  controllers: [GoogleAuthController],
  providers: [GoogleAuthService],
})
export class GoogleAuthModule {}
