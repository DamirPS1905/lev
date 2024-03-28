import { AuthInfo } from './../../decorators/auth.decorator'
import { ApiKeys } from './../../entities/ApiKeys'
import { CreateUnitDto } from './../dtos/create-unit.dto'
import { UpdateUnitDto } from './../dtos/update-unit.dto'
import { UnitsService } from './../services/units.service'
import { GenUnitsController } from './gen/units.controller'
import { EntityManager } from '@mikro-orm/postgresql'
import { Body, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

export class UnitsController extends GenUnitsController {
	
	@Get('all')
	async findAll(@AuthInfo() apiKey: ApiKeys, @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number, @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number) {
		return await super.findAll(apiKey, offset, limit);
	}
	
	@Get(':id')
	async findOne(@AuthInfo() apiKey: ApiKeys, @Param('id', ParseIntPipe) id: number) {
		return await super.findOne(apiKey, id);
	}
	
	@Post()
	async create(@AuthInfo() apiKey: ApiKeys, @Body() createDto: CreateUnitDto) {
		return await super.create(apiKey, createDto);
	}
	
	@Patch(':id')
	async update(@AuthInfo() apiKey: ApiKeys, @Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateUnitDto) {
		return await super.update(apiKey, id, updateDto);
	}
	
	@Delete(':id')
	async delete(@AuthInfo() apiKey: ApiKeys, @Param('id', ParseIntPipe) id: number) {
		return await super.delete(apiKey, id);
	}
	
	
}