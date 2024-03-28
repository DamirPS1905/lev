import { AuthInfo } from './../../decorators/auth.decorator'
import { ApiKeys } from './../../entities/ApiKeys'
import { CreateProductPropertyValueDto } from './../dtos/create-product-property-value.dto'
import { UpdateProductPropertyValueDto } from './../dtos/update-product-property-value.dto'
import { ProductPropertyValuesService } from './../services/product-property-values.service'
import { GenProductPropertyValuesController } from './gen/product-property-values.controller'
import { EntityManager } from '@mikro-orm/postgresql'
import { Body, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Patch, Query } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

export class ProductPropertyValuesController extends GenProductPropertyValuesController {
	
	@Get('all')
	async findAll(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number, @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number) {
		return await super.findAll(apiKey, catalog, offset, limit);
	}
	
	@Get('property/:property')
	async findOne(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('product') product: bigint, @Param('property', ParseIntPipe) property: number) {
		return await super.findOne(apiKey, catalog, product, property);
	}
	
	@Patch('property/:property')
	async update(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('product') product: bigint, @Param('property', ParseIntPipe) property: number, @Body() updateDto: UpdateProductPropertyValueDto) {
		return await super.update(apiKey, catalog, product, property, updateDto);
	}
	
	@Delete('property/:property')
	async delete(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('product') product: bigint, @Param('property', ParseIntPipe) property: number) {
		return await super.delete(apiKey, catalog, product, property);
	}
	
	
}