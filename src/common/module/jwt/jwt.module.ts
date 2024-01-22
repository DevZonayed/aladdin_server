import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { getDefaultJwtConfig } from '../../../common/constants';

@Module({
  imports: [JwtModule.register(getDefaultJwtConfig())],
})
export class JWTAuthModule {}
