import { AuthInfo } from './../../decorators/auth.decorator'
import { ApiKeys } from './../../entities/ApiKeys'
import { CreateOptionsPropertyValueDto } from './../dtos/create-options-property-value.dto'
import { UpdateOptionsPropertyValueDto } from './../dtos/update-options-property-value.dto'
import { OptionsPropertyValuesService } from './../services/options-property-values.service'
import { GenOptionsPropertyValuesController } from './gen/options-property-values.controller'
import { EntityManager } from '@mikro-orm/postgresql'
import { Body, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Patch, Query } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiQuery } from '@nestjs/swagger'

export class OptionsPropertyValuesController extends GenOptionsPropertyValuesController {
	
	@Get('all')
	@ApiQuery({name: 'limit', description: 'Maximum count of returning entities', required: false})
	@ApiQuery({ name: 'offset', description: 'Count of skipping entities', required: false})
	async findAll(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number, @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number) {
		return await super.findAll(apiKey, catalog, offset, limit);
	}
	
	@Get(':value')
	async findOne(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('value') value: bigint) {
		return await super.findOne(apiKey, catalog, value);
	}
	
	@Patch(':value')
	async update(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('value') value: bigint, @Body() updateDto: UpdateOptionsPropertyValueDto) {
		return await super.update(apiKey, catalog, value, updateDto);
	}
	
	@Delete(':value')
	async delete(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('value') value: bigint) {
		return await super.delete(apiKey, catalog, value);
	}
	
	
}