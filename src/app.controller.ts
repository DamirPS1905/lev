import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  
  @Get('/catalog/:catalog')
  getCatalog(@Param() params: Record<string, string>): object {
    return this.appService.getCatalog(params.catalog);
  }
}
