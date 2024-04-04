import { AuthInfo } from './../../decorators/auth.decorator'
import { ApiKeys } from './../../entities/ApiKeys'
import { CreateStoreDto } from './../dtos/create-store.dto'
import { UpdateStoreDto } from './../dtos/update-store.dto'
import { StoresService } from './../services/stores.service'
import { GenStoresController } from './gen/stores.controller'
import { EntityManager } from '@mikro-orm/postgresql'
import { Body, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiQuery } from '@nestjs/swagger'

export class StoresController extends GenStoresController {
	
	@Get('all')
	@ApiQuery({name: 'limit', description: 'Maximum count of returning entities', required: false})
	@ApiQuery({ name: 'offset', description: 'Count of skipping entities', required: false})
	async findAll(@AuthInfo() apiKey: ApiKeys, @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number, @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number) {
		return await super.findAll(apiKey, offset, limit);
	}
	
	@Get(':id')
	async findOne(@AuthInfo() apiKey: ApiKeys, @Param('id', ParseIntPipe) id: number) {
		return await super.findOne(apiKey, id);
	}
	
	@Post()
	async create(@AuthInfo() apiKey: ApiKeys, @Body() createDto: CreateStoreDto) {
		return await super.create(apiKey, createDto);
	}
	
	@Patch(':id')
	async update(@AuthInfo() apiKey: ApiKeys, @Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateStoreDto) {
		return await super.update(apiKey, id, updateDto);
	}
	
	@Delete(':id')
	async delete(@AuthInfo() apiKey: ApiKeys, @Param('id', ParseIntPipe) id: number) {
		return await super.delete(apiKey, id);
	}
	
	
}