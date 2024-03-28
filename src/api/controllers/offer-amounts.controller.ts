import { AuthInfo } from './../../decorators/auth.decorator'
import { ApiKeys } from './../../entities/ApiKeys'
import { CreateOfferAmountDto } from './../dtos/create-offer-amount.dto'
import { UpdateOfferAmountDto } from './../dtos/update-offer-amount.dto'
import { OfferAmountsService } from './../services/offer-amounts.service'
import { GenOfferAmountsController } from './gen/offer-amounts.controller'
import { EntityManager } from '@mikro-orm/postgresql'
import { Body, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

export class OfferAmountsController extends GenOfferAmountsController {
	
	@Get('all')
	async findAll(@AuthInfo() apiKey: ApiKeys, @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number, @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number) {
		return await super.findAll(apiKey, offset, limit);
	}
	
	@Get(':offer-:store')
	async findOne(@AuthInfo() apiKey: ApiKeys, @Param('offer') offer: bigint, @Param('store', ParseIntPipe) store: number) {
		return await super.findOne(apiKey, offer, store);
	}
	
	@Post()
	async create(@AuthInfo() apiKey: ApiKeys, @Body() createDto: CreateOfferAmountDto) {
		return await super.create(apiKey, createDto);
	}
	
	@Patch(':offer-:store')
	async update(@AuthInfo() apiKey: ApiKeys, @Param('offer') offer: bigint, @Param('store', ParseIntPipe) store: number, @Body() updateDto: UpdateOfferAmountDto) {
		return await super.update(apiKey, offer, store, updateDto);
	}
	
	@Delete(':offer-:store')
	async delete(@AuthInfo() apiKey: ApiKeys, @Param('offer') offer: bigint, @Param('store', ParseIntPipe) store: number) {
		return await super.delete(apiKey, offer, store);
	}
	
	
}