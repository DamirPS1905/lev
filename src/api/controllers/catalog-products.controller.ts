import { AuthInfo } from './../../decorators/auth.decorator'
import { Actors } from './../../entities/Actors'
import { CreateCatalogProductDto } from './../dtos/create-catalog-product.dto'
import { UpdateCatalogProductDto } from './../dtos/update-catalog-product.dto'
import { CatalogProductsService } from './../services/catalog-products.service'
import { GenCatalogProductsController } from './gen/catalog-products.controller'
import { EntityManager } from '@mikro-orm/postgresql'
import { Body, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ParseBigIntPipe } from './../../pipes/parse-bigint.pipe'

export class CatalogProductsController extends GenCatalogProductsController {
	
	@Get('all')
	async findAll(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number, @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number) {
		return await super.findAll(actor, catalog, offset, limit);
	}
	
	@Get(':id')
	async findOne(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('id', ParseBigIntPipe) id: bigint) {
		return await super.findOne(actor, catalog, id);
	}
	
	@Post()
	async create(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Body() createDto: CreateCatalogProductDto) {
		return await super.create(actor, catalog, createDto);
	}
	
	@Patch(':id')
	async update(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('id', ParseBigIntPipe) id: bigint, @Body() updateDto: UpdateCatalogProductDto) {
		return await super.update(actor, catalog, id, updateDto);
	}
	
	@Delete(':id')
	async delete(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('id', ParseBigIntPipe) id: bigint) {
		return await super.delete(actor, catalog, id);
	}
	
	
}