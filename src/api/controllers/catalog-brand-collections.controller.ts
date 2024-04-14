import { AuthInfo } from './../../decorators/auth.decorator';
import { ApiKeys } from './../../entities/ApiKeys';
import { CreateCatalogBrandCollectionDto } from './../dtos/create-catalog-brand-collection.dto';
import { UpdateCatalogBrandCollectionDto } from './../dtos/update-catalog-brand-collection.dto';
import { CatalogBrandCollectionsService } from './../services/catalog-brand-collections.service';
import { GenCatalogBrandCollectionsController } from './gen/catalog-brand-collections.controller';
import { EntityManager } from '@mikro-orm/postgresql';
import { Body, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export class CatalogBrandCollectionsController extends GenCatalogBrandCollectionsController {
	
	@Get('all')
	async findAll(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('brand', ParseIntPipe) brand: number) {
		return await super.findAll(apiKey, catalog, brand);
	}
	
	@Get(':id')
	async findOne(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('brand', ParseIntPipe) brand: number, @Param('id', ParseIntPipe) id: number) {
		return await super.findOne(apiKey, catalog, brand, id);
	}
	
	@Post()
	async create(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('brand', ParseIntPipe) brand: number, @Body() createDto: CreateCatalogBrandCollectionDto) {
		return await super.create(apiKey, catalog, brand, createDto);
	}
	
	@Patch(':id')
	async update(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('brand', ParseIntPipe) brand: number, @Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateCatalogBrandCollectionDto) {
		return await super.update(apiKey, catalog, brand, id, updateDto);
	}
	
	@Delete(':id')
	async delete(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('brand', ParseIntPipe) brand: number, @Param('id', ParseIntPipe) id: number) {
		return await super.delete(apiKey, catalog, brand, id);
	}
	
	
}