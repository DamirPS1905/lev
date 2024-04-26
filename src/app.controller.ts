import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Base')
@Controller()
export class AppController {
  @ApiOperation({
    summary: 'Проверка состояния сервера',
  })
  @ApiResponse({
    status: 200,
    description: 'Текущее время сервера',
  })
  @Get('check')
  check(): Date {
    return new Date();
  }
}
