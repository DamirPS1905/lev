import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { HeaderApiKeyStrategy } from './auth-header-api-key.strategy';
import { ConfigModule } from '@nestjs/config';
import { ApiKeysService } from './../api/services/api-keys.service';

@Module({
  imports: [PassportModule, ConfigModule],
  providers: [HeaderApiKeyStrategy, ApiKeysService],
})
export class AuthModule {}