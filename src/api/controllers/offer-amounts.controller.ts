import { AuthInfo } from './../../decorators/auth.decorator'
import { ApiKeys } from './../../entities/ApiKeys'
import { CreateOfferAmountDto } from './../dtos/create-offer-amount.dto'
import { UpdateOfferAmountDto } from './../dtos/update-offer-amount.dto'
import { OfferAmountsService } from './../services/offer-amounts.service'
import { GenOfferAmountsController } from './gen/offer-amounts.controller'
import { EntityManager } from '@mikro-orm/postgresql'
import { Body, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Patch, Query } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiQuery } from '@nestjs/swagger'

export class OfferAmountsController extends GenOfferAmountsController {
	
	@Get('all')
	@ApiQuery({name: 'limit', description: 'Maximum count of returning entities', required: false})
	@ApiQuery({ name: 'offset', description: 'Count of skipping entities', required: false})
	async findAll(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('offer') offer: bigint, @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number, @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number) {
		return await super.findAll(apiKey, catalog, offer, offset, limit);
	}
	
	@Get(':store/amount')
	async findOne(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('offer') offer: bigint, @Param('store', ParseIntPipe) store: number) {
		return await super.findOne(apiKey, catalog, offer, store);
	}
	
	@Patch(':store/amount')
	async update(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('offer') offer: bigint, @Param('store', ParseIntPipe) store: number, @Body() updateDto: UpdateOfferAmountDto) {
		return await super.update(apiKey, catalog, offer, store, updateDto);
	}
	
	@Delete(':store/amount')
	async delete(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('offer') offer: bigint, @Param('store', ParseIntPipe) store: number) {
		return await super.delete(apiKey, catalog, offer, store);
	}
	
	
}