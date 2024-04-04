import { AuthInfo } from './../../decorators/auth.decorator'
import { ApiKeys } from './../../entities/ApiKeys'
import { CreateProductPriceDto } from './../dtos/create-product-price.dto'
import { UpdateProductPriceDto } from './../dtos/update-product-price.dto'
import { ProductPricesService } from './../services/product-prices.service'
import { GenProductPricesController } from './gen/product-prices.controller'
import { EntityManager } from '@mikro-orm/postgresql'
import { Body, Delete, Get, Param, ParseIntPipe, Patch } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

export class ProductPricesController extends GenProductPricesController {
	
	@Get('all')
	async findAll(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number) {
		return await super.findAll(apiKey, catalog);
	}
	
	@Get(':priceType')
	async findOne(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('product') product: bigint, @Param('priceType', ParseIntPipe) priceType: number) {
		return await super.findOne(apiKey, catalog, product, priceType);
	}
	
	@Patch(':priceType')
	async update(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('product') product: bigint, @Param('priceType', ParseIntPipe) priceType: number, @Body() updateDto: UpdateProductPriceDto) {
		return await super.update(apiKey, catalog, product, priceType, updateDto);
	}
	
	@Delete(':priceType')
	async delete(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('product') product: bigint, @Param('priceType', ParseIntPipe) priceType: number) {
		return await super.delete(apiKey, catalog, product, priceType);
	}
	
	
}