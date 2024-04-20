import { AuthInfo } from './../../decorators/auth.decorator';
import { Actors } from './../../entities/Actors';
import { CreateCatalogBrandCollectionDto } from './../dtos/create-catalog-brand-collection.dto';
import { UpdateCatalogBrandCollectionDto } from './../dtos/update-catalog-brand-collection.dto';
import { CatalogBrandCollectionsService } from './../services/catalog-brand-collections.service';
import { GenCatalogBrandCollectionsController } from './gen/catalog-brand-collections.controller';
import { EntityManager } from '@mikro-orm/postgresql';
import { Body, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiParam } from '@nestjs/swagger'

export class CatalogBrandCollectionsController extends GenCatalogBrandCollectionsController {
	
	@Get('all')
	@ApiOperation({summary: "Получение списка коллекций бренда"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	async findAll(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('brand', ParseIntPipe) brand: number) {
		return await super.findAll(actor, catalog, brand);
	}
	
	@Get(':id')
	@ApiOperation({summary: "Получение информации о коллекци бренда"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'id', description: 'ID коллекции бренда'})
	async findOne(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('brand', ParseIntPipe) brand: number, @Param('id', ParseIntPipe) id: number) {
		return await super.findOne(actor, catalog, brand, id);
	}
	
	@Post()
	@ApiOperation({summary: "Создание коллекци бренда"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	async create(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('brand', ParseIntPipe) brand: number, @Body() createDto: CreateCatalogBrandCollectionDto) {
		return await super.create(actor, catalog, brand, createDto);
	}
	
	async validateCreate(actor: Actors, catalog: number, brand: number, createDto: CreateCatalogBrandCollectionDto, em: EntityManager){
		if(createDto.image){
			createDto.image = await this.fileLoadTasksService.processInput(actor.company.id, catalog, createDto.image, true, em);
		}
	}
	
	@Patch(':id')
	@ApiOperation({summary: "Обновление информации о коллекци бренда"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'id', description: 'ID коллекции бренда'})
	async update(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('brand', ParseIntPipe) brand: number, @Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateCatalogBrandCollectionDto) {
		return await super.update(actor, catalog, brand, id, updateDto);
	}
	
	async validateUpdate(entity, actor: Actors, catalog: number, brand: number, id: number, updateDto: UpdateCatalogBrandCollectionDto, em: EntityManager){
		if(updateDto.image){
			updateDto.image = await this.fileLoadTasksService.processInput(actor.company.id, catalog, updateDto.image, true, em);
		}
	}
	
	@Delete(':id')
	@ApiOperation({summary: "Удаление коллекци бренда"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'id', description: 'ID коллекции бренда'})
	async delete(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('brand', ParseIntPipe) brand: number, @Param('id', ParseIntPipe) id: number) {
		return await super.delete(actor, catalog, brand, id);
	}
	
	
}