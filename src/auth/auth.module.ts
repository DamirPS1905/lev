import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { HeaderApiKeyStrategy } from './auth-header-api-key.strategy';
import { ConfigModule } from '@nestjs/config';
import { ApiKeysService } from './../api/services/api-keys.service';
import { FilesService } from './../api/services/special/files.service';

@Module({
  imports: [PassportModule, ConfigModule],
  providers: [HeaderApiKeyStrategy, ApiKeysService, FilesService],
})
export class AuthModule {}