import { AuthInfo } from './../../decorators/auth.decorator'
import { ApiKeys } from './../../entities/ApiKeys'
import { CreateOffersPriceDto } from './../dtos/create-offers-price.dto'
import { UpdateOffersPriceDto } from './../dtos/update-offers-price.dto'
import { OffersPricesService } from './../services/offers-prices.service'
import { GenOffersPricesController } from './gen/offers-prices.controller'
import { EntityManager } from '@mikro-orm/postgresql'
import { Body, Delete, Get, Param, ParseIntPipe, Patch } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

export class OffersPricesController extends GenOffersPricesController {
	
	@Get('all')
	async findAll(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number) {
		return await super.findAll(apiKey, catalog);
	}
	
	@Get(':priceType')
	async findOne(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('offer') offer: bigint, @Param('priceType', ParseIntPipe) priceType: number) {
		return await super.findOne(apiKey, catalog, offer, priceType);
	}
	
	@Patch(':priceType')
	async update(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('offer') offer: bigint, @Param('priceType', ParseIntPipe) priceType: number, @Body() updateDto: UpdateOffersPriceDto) {
		return await super.update(apiKey, catalog, offer, priceType, updateDto);
	}
	
	@Delete(':priceType')
	async delete(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('offer') offer: bigint, @Param('priceType', ParseIntPipe) priceType: number) {
		return await super.delete(apiKey, catalog, offer, priceType);
	}
	
	
}