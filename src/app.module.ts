import { MikroOrmModule } from '@mikro-orm/nestjs';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ExchangeApi } from './api/exchange-api.module';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { RCBService } from './tasks/rcb.service';
import { UserModule } from './user/user.module';
import { WebAuthModule } from './web_auth/web_auth.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    MikroOrmModule.forRoot(),
    ExchangeApi,
    AuthModule,
    WebAuthModule,
    UserModule,
    HttpModule,
  ],
  controllers: [AppController],
  providers: [RCBService],
})
export class AppModule {}
