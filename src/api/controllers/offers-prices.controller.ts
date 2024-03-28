import { AuthInfo } from './../../decorators/auth.decorator'
import { ApiKeys } from './../../entities/ApiKeys'
import { CreateOffersPriceDto } from './../dtos/create-offers-price.dto'
import { UpdateOffersPriceDto } from './../dtos/update-offers-price.dto'
import { OffersPricesService } from './../services/offers-prices.service'
import { GenOffersPricesController } from './gen/offers-prices.controller'
import { EntityManager } from '@mikro-orm/postgresql'
import { Body, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

export class OffersPricesController extends GenOffersPricesController {
	
	@Get('all')
	async findAll(@AuthInfo() apiKey: ApiKeys, @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number, @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number) {
		return await super.findAll(apiKey, offset, limit);
	}
	
	@Get(':offer-:priceType')
	async findOne(@AuthInfo() apiKey: ApiKeys, @Param('offer') offer: bigint, @Param('priceType', ParseIntPipe) priceType: number) {
		return await super.findOne(apiKey, offer, priceType);
	}
	
	@Post()
	async create(@AuthInfo() apiKey: ApiKeys, @Body() createDto: CreateOffersPriceDto) {
		return await super.create(apiKey, createDto);
	}
	
	@Patch(':offer-:priceType')
	async update(@AuthInfo() apiKey: ApiKeys, @Param('offer') offer: bigint, @Param('priceType', ParseIntPipe) priceType: number, @Body() updateDto: UpdateOffersPriceDto) {
		return await super.update(apiKey, offer, priceType, updateDto);
	}
	
	@Delete(':offer-:priceType')
	async delete(@AuthInfo() apiKey: ApiKeys, @Param('offer') offer: bigint, @Param('priceType', ParseIntPipe) priceType: number) {
		return await super.delete(apiKey, offer, priceType);
	}
	
	
}