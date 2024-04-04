import { AuthInfo } from './../../decorators/auth.decorator'
import { ApiKeys } from './../../entities/ApiKeys'
import { CreatePriceTypeDto } from './../dtos/create-price-type.dto'
import { UpdatePriceTypeDto } from './../dtos/update-price-type.dto'
import { PriceTypesService } from './../services/price-types.service'
import { GenPriceTypesController } from './gen/price-types.controller'
import { EntityManager } from '@mikro-orm/postgresql'
import { Body, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

export class PriceTypesController extends GenPriceTypesController {
	
	@Get('all')
	async findAll(@AuthInfo() apiKey: ApiKeys) {
		return await super.findAll(apiKey);
	}
	
	@Get(':id')
	async findOne(@AuthInfo() apiKey: ApiKeys, @Param('id', ParseIntPipe) id: number) {
		return await super.findOne(apiKey, id);
	}
	
	@Post()
	async create(@AuthInfo() apiKey: ApiKeys, @Body() createDto: CreatePriceTypeDto) {
		return await super.create(apiKey, createDto);
	}
	
	@Patch(':id')
	async update(@AuthInfo() apiKey: ApiKeys, @Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdatePriceTypeDto) {
		return await super.update(apiKey, id, updateDto);
	}
	
	@Delete(':id')
	async delete(@AuthInfo() apiKey: ApiKeys, @Param('id', ParseIntPipe) id: number) {
		return await super.delete(apiKey, id);
	}
	
	
}