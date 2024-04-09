import { Controller, Body, Get, Param, Patch, Post, ParseIntPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiParam, ApiQuery, ApiBody, ApiExtraModels, ApiHeader, ApiTags } from '@nestjs/swagger'

@ApiTags('Base')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
		
  @Get('date')
  getHello(): Date {
    return this.appService.getDate();
  }
    
}
