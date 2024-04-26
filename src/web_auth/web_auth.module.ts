import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { UserModule } from '../user/user.module';
import { options } from './config';
import { GUARDS } from './guargs';
import { STRTAGIES } from './strategies';
import { WebAuthController } from './web_auth.controller';
import { WebAuthService } from './web_auth.service';

@Module({
  controllers: [WebAuthController],
  providers: [WebAuthService, ...STRTAGIES, ...GUARDS],
  imports: [PassportModule, JwtModule.registerAsync(options()), UserModule, HttpModule],
})
export class WebAuthModule {}
