import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { ApiKeysService } from './../api/services/api-keys.service';
import { FilesService } from './../api/services/special/files.service';
import { HeaderApiKeyStrategy } from './auth-header-api-key.strategy';

@Module({
  imports: [PassportModule, ConfigModule],
  providers: [HeaderApiKeyStrategy, ApiKeysService, FilesService],
})
export class AuthModule {}
