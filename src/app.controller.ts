import { Controller, Body, Get, Param, Patch, Post, ParseIntPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiParam, ApiOperation, ApiResponse, ApiQuery, ApiBody, ApiExtraModels, ApiHeader, ApiTags } from '@nestjs/swagger'

@ApiTags('Base')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
	
	@ApiOperation({summary: "Возвращает текущее время сервера. Время не должно отличаться от клиентского более чем на 5 минут с учетом часового пояса."})
	@ApiResponse({
		status: 200,
		description: 'Текущее время сервера',
 	})
  @Get('date')
  getHello(): Date {
    return this.appService.getDate();
  }
    
}
