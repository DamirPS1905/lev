import { AuthInfo } from './../../decorators/auth.decorator'
import { Actors } from './../../entities/Actors'
import { CreateCatalogBrandDto } from './../dtos/create-catalog-brand.dto'
import { UpdateCatalogBrandDto } from './../dtos/update-catalog-brand.dto'
import { CatalogBrandsService } from './../services/catalog-brands.service'
import { GenCatalogBrandsController } from './gen/catalog-brands.controller'
import { EntityManager } from '@mikro-orm/postgresql'
import { Body, Delete, Get, Param, ParseIntPipe, DefaultValuePipe, Patch, Post, Query } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

export class CatalogBrandsController extends GenCatalogBrandsController {
	
	@Get('all')
	async findAll(@AuthInfo() apiKey: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number, @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number) {
		return await super.findAll(apiKey, catalog, offset, limit);
	}
	
	@Get(':id')
	async findOne(@AuthInfo() apiKey: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('id', ParseIntPipe) id: number) {
		return await super.findOne(apiKey, catalog, id);
	}
	
	@Post()
	async create(@AuthInfo() apiKey: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Body() createDto: CreateCatalogBrandDto) {
		return await super.create(apiKey, catalog, createDto);
	}
	
	@Patch(':id')
	async update(@AuthInfo() apiKey: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateCatalogBrandDto) {
		return await super.update(apiKey, catalog, id, updateDto);
	}
	
	@Delete(':id')
	async delete(@AuthInfo() apiKey: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('id', ParseIntPipe) id: number) {
		return await super.delete(apiKey, catalog, id);
	}
	
	
}