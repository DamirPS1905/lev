import { AuthInfo } from './../../decorators/auth.decorator'
import { ApiKeys } from './../../entities/ApiKeys'
import { CreateTypePropertyValueDto } from './../dtos/create-type-property-value.dto'
import { UpdateTypePropertyValueDto } from './../dtos/update-type-property-value.dto'
import { TypePropertyValuesService } from './../services/type-property-values.service'
import { GenTypePropertyValuesController } from './gen/type-property-values.controller'
import { EntityManager } from '@mikro-orm/postgresql'
import { Body, Delete, Get, Param, ParseIntPipe, Patch } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

export class TypePropertyValuesController extends GenTypePropertyValuesController {
	
	@Get('all')
	async findAll(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('type', ParseIntPipe) type: number) {
		return await super.findAll(apiKey, catalog, type);
	}
	
	@Get('property/:property')
	async findOne(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('type', ParseIntPipe) type: number, @Param('property', ParseIntPipe) property: number) {
		return await super.findOne(apiKey, catalog, type, property);
	}
	
	@Patch('property/:property')
	async update(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('type', ParseIntPipe) type: number, @Param('property', ParseIntPipe) property: number, @Body() updateDto: UpdateTypePropertyValueDto) {
		return await super.update(apiKey, catalog, type, property, updateDto);
	}
	
	@Delete('property/:property')
	async delete(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('type', ParseIntPipe) type: number, @Param('property', ParseIntPipe) property: number) {
		return await super.delete(apiKey, catalog, type, property);
	}
	
	
}