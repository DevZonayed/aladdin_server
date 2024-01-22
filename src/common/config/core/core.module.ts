import { Global, Logger, Module } from '@nestjs/common';
import { CoreConfigService } from './core.service';

@Global()
@Module({
  providers: [CoreConfigService, Logger],
  exports: [CoreConfigService, Logger],
})
export class CoreConfigModule {}
