import { Global, Module, forwardRef } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { NotificationService } from './service/notification.service';

@Global()
@Module({
  imports: [forwardRef(() => UserModule)],
  providers: [NotificationService],
  exports: [NotificationService]
})
export class NotificationModule { }
