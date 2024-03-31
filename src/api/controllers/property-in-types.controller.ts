import { AuthInfo } from './../../decorators/auth.decorator'
import { ApiKeys } from './../../entities/ApiKeys'
import { CreatePropertyInTypeDto } from './../dtos/create-property-in-type.dto'
import { UpdatePropertyInTypeDto } from './../dtos/update-property-in-type.dto'
import { PropertyInTypesService } from './../services/property-in-types.service'
import { GenPropertyInTypesController } from './gen/property-in-types.controller'
import { EntityManager } from '@mikro-orm/postgresql'
import { Body, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Patch, Query } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiQuery } from '@nestjs/swagger'

export class PropertyInTypesController extends GenPropertyInTypesController {
	
	@Get('all')
	@ApiQuery({name: 'limit', description: 'Maximum count of returning entities', required: false})
	@ApiQuery({ name: 'offset', description: 'Count of skipping entities', required: false})
	async findAll(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number, @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number) {
		//return await super.findAll(apiKey, catalog, offset, limit);
	}
	
	@Get(':property')
	async findOne(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('type', ParseIntPipe) type: number, @Param('property', ParseIntPipe) property: number) {
		return await super.findOne(apiKey, catalog, type, property);
	}
	
	@Patch(':property')
	async update(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('type', ParseIntPipe) type: number, @Param('property', ParseIntPipe) property: number, @Body() updateDto: UpdatePropertyInTypeDto) {
		return await super.update(apiKey, catalog, type, property, updateDto);
	}
	
	@Delete(':property')
	async delete(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('type', ParseIntPipe) type: number, @Param('property', ParseIntPipe) property: number) {
		return await super.delete(apiKey, catalog, type, property);
	}
	
}