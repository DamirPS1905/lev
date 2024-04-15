import { AuthInfo } from './../../decorators/auth.decorator'
import { Actors } from './../../entities/Actors'
import { CreatePriceTypeDto } from './../dtos/create-price-type.dto'
import { UpdatePriceTypeDto } from './../dtos/update-price-type.dto'
import { PriceTypesService } from './../services/price-types.service'
import { GenPriceTypesController } from './gen/price-types.controller'
import { EntityManager } from '@mikro-orm/postgresql'
import { Body, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiOperation, ApiParam } from '@nestjs/swagger'

export class PriceTypesController extends GenPriceTypesController {
	
	@Get('all')
	@ApiOperation({summary: "Получение всех типов цен"})
	async findAll(@AuthInfo() actor: Actors) {
		return await super.findAll(actor);
	}
	
	@Get(':id')
	@ApiOperation({summary: "Получение цены товара определенного типа"})
	@ApiParam({name: 'id', description: 'ID типа цены'})
	async findOne(@AuthInfo() actor: Actors, @Param('id', ParseIntPipe) id: number) {
		return await super.findOne(actor, id);
	}
	
	@Post()
	async create(@AuthInfo() actor: Actors, @Body() createDto: CreatePriceTypeDto) {
		return await super.create(actor, createDto);
	}
	
	@Patch(':id')
	async update(@AuthInfo() actor: Actors, @Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdatePriceTypeDto) {
		return await super.update(actor, id, updateDto);
	}
	
	@Delete(':id')
	async delete(@AuthInfo() actor: Actors, @Param('id', ParseIntPipe) id: number) {
		return await super.delete(actor, id);
	}
	

}