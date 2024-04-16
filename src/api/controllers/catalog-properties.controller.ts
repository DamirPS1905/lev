import { AuthInfo } from './../../decorators/auth.decorator'
import { Actors } from './../../entities/Actors'
import { CreateCatalogPropertyDto } from './../dtos/create-catalog-property.dto'
import { UpdateCatalogPropertyDto } from './../dtos/update-catalog-property.dto'
import { CatalogPropertiesService } from './../services/catalog-properties.service'
import { GenCatalogPropertiesController } from './gen/catalog-properties.controller'
import { EntityManager } from '@mikro-orm/postgresql'
import { Body, DefaultValuePipe, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiQuery, ApiOperation, ApiParam } from '@nestjs/swagger'

export class CatalogPropertiesController extends GenCatalogPropertiesController {
	
	@Get('all')
	@ApiOperation({summary: "Получение списка свойств в каталоге (с пагинацией)"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiQuery({name: 'limit', description: 'Maximum count of returning entities', required: false})
	@ApiQuery({ name: 'offset', description: 'Count of skipping entities', required: false})
	async findAll(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number, @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number) {
		return await super.findAll(actor, catalog, offset, limit);
	}
	
	@Get(':id')
	@ApiOperation({summary: "Получение определенного свойства"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'id', description: 'ID свойства'})
	async findOne(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('id', ParseIntPipe) id: number) {
		return await super.findOne(actor, catalog, id);
	}
	
	@Get(':id/value-scheme')
	@ApiOperation({summary: "Получение схемы применяемой для задания значения данного свойства"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'id', description: 'ID свойства'})
	async getScheme(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('id', ParseIntPipe) id: number) {
		const propertyIns = await super.findOne(actor, catalog, id);
		return this.propertyTypesService.getValueScheme(propertyIns.scheme);
	}
	
	@Post()
	@ApiOperation({summary: "Создание свойства"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	async create(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Body() createDto: CreateCatalogPropertyDto) {
		return await super.create(actor, catalog, createDto);
	}
	
	async validateCreate(actor: Actors, catalog: number, createDto: CreateCatalogPropertyDto, em: EntityManager) {
		try{
			const propertyTypeIns = await this.propertyTypesService.findById(createDto.type);
			createDto.scheme = await this.propertyTypesService.tunePropertyScheme(actor.company.id, propertyTypeIns.scheme, createDto.scheme, true);
		}catch(e){
			throw new HttpException(e.message, HttpStatus.CONFLICT);
		}
	}
	
	@Patch(':id')
	@ApiOperation({summary: "Обновление информации об определенном свойстве"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'id', description: 'ID свойства'})
	async update(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateCatalogPropertyDto) {
		return await super.update(actor, catalog, id, updateDto);
	}
	
	async validateUpdate(entity, actor: Actors, catalog: number, id: number, updateDto: UpdateCatalogPropertyDto, em: EntityManager) {
		if(updateDto.scheme instanceof Object){
			try{
				const propertyTypeIns = await this.propertyTypesService.findById(entity.type.id);
				updateDto.scheme = await this.propertyTypesService.tunePropertyScheme(actor.company.id, propertyTypeIns.scheme, updateDto.scheme, true);
			}catch(e){
				throw new HttpException(e.message, HttpStatus.CONFLICT);
			}
		}
	}
	
	@Delete(':id')
	@ApiOperation({summary: "Удаление свойства"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'id', description: 'ID свойства'})
	async delete(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('id', ParseIntPipe) id: number) {
		return await super.delete(actor, catalog, id);
	}
	
	
}