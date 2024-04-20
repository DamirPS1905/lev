import { AuthInfo } from './../../decorators/auth.decorator'
import { Actors } from './../../entities/Actors'
import { CreateCatalogBrandDto } from './../dtos/create-catalog-brand.dto'
import { UpdateCatalogBrandDto } from './../dtos/update-catalog-brand.dto'
import { CatalogBrandsService } from './../services/catalog-brands.service'
import { GenCatalogBrandsController } from './gen/catalog-brands.controller'
import { EntityManager } from '@mikro-orm/postgresql'
import { Body, Delete, Get, Param, ParseIntPipe, DefaultValuePipe, Patch, Post, Query } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiQuery, ApiOperation, ApiParam } from '@nestjs/swagger'

export class CatalogBrandsController extends GenCatalogBrandsController {
	
	@Get('all')
	@ApiOperation({summary: "Получение списка брендов в каталоге (с пагинацией)"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiQuery({name: 'limit', description: 'Maximum count of returning entities', required: false})
	@ApiQuery({ name: 'offset', description: 'Count of skipping entities', required: false})
	async findAll(@AuthInfo() apiKey: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number, @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number) {
		return await super.findAll(apiKey, catalog, offset, limit);
	}
	
	@Get(':id')
	@ApiOperation({summary: "Получение определенного бренда"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'id', description: 'ID бренда'})
	async findOne(@AuthInfo() apiKey: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('id', ParseIntPipe) id: number) {
		return await super.findOne(apiKey, catalog, id);
	}
	
	@Post()
	@ApiOperation({summary: "Создание бренда"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	async create(@AuthInfo() apiKey: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Body() createDto: CreateCatalogBrandDto) {
		return await super.create(apiKey, catalog, createDto);
	}
	
	async validateCreate(actor: Actors, catalog: number, createDto: CreateCatalogBrandDto, em: EntityManager){
		if(createDto.image){
			createDto.image = await this.fileLoadTasksService.processInput(actor.company.id, catalog, createDto.image, true, em);
		}
	}
	
	@Patch(':id')
	@ApiOperation({summary: "Обновление информации об определенном бренде"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'id', description: 'ID бренда'})
	async update(@AuthInfo() apiKey: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateCatalogBrandDto) {
		return await super.update(apiKey, catalog, id, updateDto);
	}
	
	async validateUpdate(entity, actor: Actors, catalog: number, id: number, updateDto: UpdateCatalogBrandDto, em: EntityManager){
		if(updateDto.image){
			updateDto.image = await this.fileLoadTasksService.processInput(actor.company.id, catalog, updateDto.image, true, em);
		}
	}

	@Delete(':id')
	@ApiOperation({summary: "Удаление бренда"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'id', description: 'ID бренда'})
	async delete(@AuthInfo() apiKey: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('id', ParseIntPipe) id: number) {
		return await super.delete(apiKey, catalog, id);
	}
	
	
}