import { AuthInfo } from './../../decorators/auth.decorator'
import { ApiKeys } from './../../entities/ApiKeys'
import { CreateCatalogProductDto } from './../dtos/create-catalog-product.dto'
import { UpdateCatalogProductDto } from './../dtos/update-catalog-product.dto'
import { CatalogProductsService } from './../services/catalog-products.service'
import { GenCatalogProductsController } from './gen/catalog-products.controller'
import { EntityManager } from '@mikro-orm/postgresql'
import { Body, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

export class CatalogProductsController extends GenCatalogProductsController {
	
	@Get(':id')
	async findOne(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('id') id: bigint) {
		return await super.findOne(apiKey, catalog, id);
	}
	
	@Post()
	async create(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Body() createDto: CreateCatalogProductDto) {
		return await super.create(apiKey, catalog, createDto);
	}
	
	@Patch(':id')
	async update(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('id') id: bigint, @Body() updateDto: UpdateCatalogProductDto) {
		return await super.update(apiKey, catalog, id, updateDto);
	}
	
	@Delete(':id')
	async delete(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('id') id: bigint) {
		return await super.delete(apiKey, catalog, id);
	}
	
	
}