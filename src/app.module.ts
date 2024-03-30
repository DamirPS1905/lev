import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ExchangeApi } from './api/exchange-api.module';
import { AuthModule } from './auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ImagesService } from './tasks/images.service'
import { RCBService } from './tasks/rcb.service'
import { HttpModule } from '@nestjs/axios'

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
  providers: [AppService, ImagesService, RCBService],
})
export class AppModule {}
