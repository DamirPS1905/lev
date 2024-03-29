import { AuthInfo } from './../../decorators/auth.decorator'
import { ApiKeys } from './../../entities/ApiKeys'
import { CreateProductPriceDto } from './../dtos/create-product-price.dto'
import { UpdateProductPriceDto } from './../dtos/update-product-price.dto'
import { ProductPricesService } from './../services/product-prices.service'
import { GenProductPricesController } from './gen/product-prices.controller'
import { EntityManager } from '@mikro-orm/postgresql'
import { Body, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

export class ProductPricesController extends GenProductPricesController {
	
	@Get('all')
	async findAll(@AuthInfo() apiKey: ApiKeys, @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number, @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number) {
		return await super.findAll(apiKey, offset, limit);
	}
	
	@Get(':product-:priceType')
	async findOne(@AuthInfo() apiKey: ApiKeys, @Param('product') product: bigint, @Param('priceType', ParseIntPipe) priceType: number) {
		return await super.findOne(apiKey, product, priceType);
	}
		
	@Patch(':product-:priceType')
	async update(@AuthInfo() apiKey: ApiKeys, @Param('product') product: bigint, @Param('priceType', ParseIntPipe) priceType: number, @Body() updateDto: UpdateProductPriceDto) {
		return await super.update(apiKey, product, priceType, updateDto);
	}
	
	@Delete(':product-:priceType')
	async delete(@AuthInfo() apiKey: ApiKeys, @Param('product') product: bigint, @Param('priceType', ParseIntPipe) priceType: number) {
		return await super.delete(apiKey, product, priceType);
	}
	
	
}