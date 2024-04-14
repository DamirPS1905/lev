import { AuthInfo } from './../../decorators/auth.decorator'
import { ApiKeys } from './../../entities/ApiKeys'
import { CreateCatalogProductOfferDto } from './../dtos/create-catalog-product-offer.dto'
import { UpdateCatalogProductOfferDto } from './../dtos/update-catalog-product-offer.dto'
import { CatalogProductOffersService } from './../services/catalog-product-offers.service'
import { GenCatalogProductOffersController } from './gen/catalog-product-offers.controller'
import { EntityManager } from '@mikro-orm/postgresql'
import { Body, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ParseBigIntPipe } from './../../pipes/parse-bigint.pipe'

export class CatalogProductOffersController extends GenCatalogProductOffersController {
	
	@Get('all')
	async findAll(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('product', ParseBigIntPipe) product: bigint, @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number, @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number) {
		return await super.findAll(apiKey, catalog, product, offset, limit);
	}
	
	@Get(':id')
	async findOne(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('product', ParseBigIntPipe) product: bigint, @Param('id', ParseBigIntPipe) id: bigint) {
		return await super.findOne(apiKey, catalog, product, id);
	}
	
	@Post()
	async create(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('product', ParseBigIntPipe) product: bigint, @Body() createDto: CreateCatalogProductOfferDto) {
		return await super.create(apiKey, catalog, product, createDto);
	}
	
	@Patch(':id')
	async update(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('product', ParseBigIntPipe) product: bigint, @Param('id', ParseBigIntPipe) id: bigint, @Body() updateDto: UpdateCatalogProductOfferDto) {
		return await super.update(apiKey, catalog, product, id, updateDto);
	}
	
	@Delete(':id')
	async delete(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('product', ParseBigIntPipe) product: bigint, @Param('id', ParseBigIntPipe) id: bigint) {
		return await super.delete(apiKey, catalog, product, id);
	}
	
	
}