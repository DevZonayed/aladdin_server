import { Global, Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { NotificationService } from './service/notification.service';

@Global()
@Module({
  imports: [UserModule],
  providers: [NotificationService],
  exports: [NotificationService]
})
export class NotificationModule { }
