import { Body, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiParam } from '@nestjs/swagger';
import { AuthInfo } from './../../decorators/auth.decorator';
import { Actors } from './../../entities/Actors';
import { CreateCatalogDto } from './../dtos/create-catalog.dto';
import { UpdateCatalogDto } from './../dtos/update-catalog.dto';
import { GenCatalogsController } from './gen/catalogs.controller';

export class CatalogsController extends GenCatalogsController {
  @Get('all')
  @ApiOperation({ summary: 'Получение списка каталогов' })
  async findAll(@AuthInfo() actor: Actors) {
    return await super.findAll(actor);
  }

  // @Post()
  @ApiOperation({ summary: 'Создание нового каталога' })
  async create(@AuthInfo() actor: Actors, @Body() createDto: CreateCatalogDto) {
    return await super.create(actor, createDto);
  }

  // @Patch(':id')
  @ApiOperation({ summary: 'Обновление каталога' })
  @ApiParam({ name: 'id', description: 'ID каталога' })
  async update(
    @AuthInfo() actor: Actors,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateCatalogDto,
  ) {
    return await super.update(actor, id, updateDto);
  }

  // @Delete(':id')
  @ApiOperation({ summary: 'Удаление каталога' })
  @ApiParam({ name: 'id', description: 'ID каталога' })
  async delete(
    @AuthInfo() actor: Actors,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await super.delete(actor, id);
  }
}
