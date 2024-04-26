import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('Base')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({
    summary:
      'Возвращает текущее время сервера. Время не должно отличаться от клиентского более чем на 5 минут с учетом часового пояса.',
  })
  @ApiResponse({
    status: 200,
    description: 'Текущее время сервера',
  })
  @Get('date')
  getHello(): Date {
    return this.appService.getDate();
  }
}
