import { Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AuthInfo } from './../../decorators/auth.decorator';
import { Actors } from './../../entities/Actors';
import { GenPropertyPrimitivesController } from './gen/property-primitives.controller';

export class PropertyPrimitivesController extends GenPropertyPrimitivesController {
  @Get('all')
  @ApiOperation({ summary: 'Получение всех доступных примитивов зачений свойств' })
  async findAll(@AuthInfo() actor: Actors) {
    return await super.findAll(actor);
  }
}
