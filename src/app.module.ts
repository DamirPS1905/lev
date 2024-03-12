import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ConfigModule, ConfigService} from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ExchangeApi } from './api/exchange-api.module';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [
	  ConfigModule.forRoot(),
	  MikroOrmModule.forRoot(),
	  ExchangeApi,
	  AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
