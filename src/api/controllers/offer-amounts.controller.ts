import { AuthInfo } from './../../decorators/auth.decorator'
import { Actors } from './../../entities/Actors'
import { CreateOfferAmountDto } from './../dtos/create-offer-amount.dto'
import { UpdateOfferAmountDto } from './../dtos/update-offer-amount.dto'
import { OfferAmountsService } from './../services/offer-amounts.service'
import { GenOfferAmountsController } from './gen/offer-amounts.controller'
import { EntityManager } from '@mikro-orm/postgresql'
import { Body, Delete, Get, Param, ParseIntPipe, Patch } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ParseBigIntPipe } from './../../pipes/parse-bigint.pipe'

export class OfferAmountsController extends GenOfferAmountsController {
	
	@Get('all')
	async findAll(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('offer', ParseBigIntPipe) offer: bigint) {
		return await super.findAll(actor, catalog, offer);
	}
	
	@Get(':store/amount')
	async findOne(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('offer', ParseBigIntPipe) offer: bigint, @Param('store', ParseIntPipe) store: number) {
		return await super.findOne(actor, catalog, offer, store);
	}
	
	@Patch(':store/amount')
	async update(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('offer', ParseBigIntPipe) offer: bigint, @Param('store', ParseIntPipe) store: number, @Body() updateDto: UpdateOfferAmountDto) {
		return await super.update(actor, catalog, offer, store, updateDto);
	}
	
	@Delete(':store/amount')
	async delete(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('offer', ParseBigIntPipe) offer: bigint, @Param('store', ParseIntPipe) store: number) {
		return await super.delete(actor, catalog, offer, store);
	}
	
	
}