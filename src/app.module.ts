import { ExchangeApi } from './api/exchange-api.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { RCBService } from './tasks/rcb.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
	  ScheduleModule.forRoot(),
	  ConfigModule.forRoot(),
	  MikroOrmModule.forRoot(),
	  ExchangeApi,
	  AuthModule,
	  HttpModule
	 ],
	 controllers: [AppController],
	 providers: [AppService, RCBService],
})
export class AppModule {}
