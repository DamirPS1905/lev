import { AuthInfo } from './../../decorators/auth.decorator'
import { ApiKeys } from './../../entities/ApiKeys'
import { CreatePropertyValueDto } from './../dtos/create-property-value.dto'
import { UpdatePropertyValueDto } from './../dtos/update-property-value.dto'
import { PropertyValuesService } from './../services/property-values.service'
import { GenPropertyValuesController } from './gen/property-values.controller'
import { EntityManager } from '@mikro-orm/postgresql'
import { Body, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

export class PropertyValuesController extends GenPropertyValuesController {
	
	@Get('all')
	async findAll(@AuthInfo() apiKey: ApiKeys, @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number, @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number) {
		return await super.findAll(apiKey, offset, limit);
	}
	
	@Get(':order-:valueKey')
	async findOne(@AuthInfo() apiKey: ApiKeys, @Param('order', ParseIntPipe) order: number, @Param('valueKey') valueKey: bigint) {
		return await super.findOne(apiKey, order, valueKey);
	}
	
	@Post()
	async create(@AuthInfo() apiKey: ApiKeys, @Body() createDto: CreatePropertyValueDto) {
		return await super.create(apiKey, createDto);
	}
	
	@Patch(':order-:valueKey')
	async update(@AuthInfo() apiKey: ApiKeys, @Param('order', ParseIntPipe) order: number, @Param('valueKey') valueKey: bigint, @Body() updateDto: UpdatePropertyValueDto) {
		return await super.update(apiKey, order, valueKey, updateDto);
	}
	
	@Delete(':order-:valueKey')
	async delete(@AuthInfo() apiKey: ApiKeys, @Param('order', ParseIntPipe) order: number, @Param('valueKey') valueKey: bigint) {
		return await super.delete(apiKey, order, valueKey);
	}
	
	
}