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
import { ApiOperation, ApiParam } from '@nestjs/swagger'

export class OfferAmountsController extends GenOfferAmountsController {
	
	@Get('all')
	@ApiOperation({summary: "Получение остаков товарного предложения на всех складах"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'offer', description: 'ID товарного предложения'})
	async findAll(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('offer', ParseBigIntPipe) offer: bigint) {
		return await super.findAll(actor, catalog, offer);
	}
	
	@Get(':store/amount')
	@ApiOperation({summary: "Получение остаков товарного предложения на определенном складе"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'offer', description: 'ID товарного предложения'})
	@ApiParam({name: 'store', description: 'ID склада'})
	async findOne(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('offer', ParseBigIntPipe) offer: bigint, @Param('store', ParseIntPipe) store: number) {
		return await super.findOne(actor, catalog, offer, store);
	}
	
	@Patch(':store/amount')
	@ApiOperation({summary: "Задание или обновление остаков товарного предложения на определенном складе"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'offer', description: 'ID товарного предложения'})
	@ApiParam({name: 'store', description: 'ID склада'})
	async update(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('offer', ParseBigIntPipe) offer: bigint, @Param('store', ParseIntPipe) store: number, @Body() updateDto: UpdateOfferAmountDto) {
		return await super.update(actor, catalog, offer, store, updateDto);
	}
	
	@Delete(':store/amount')
	@ApiOperation({summary: "Удаление записи об остаках товарного предложения на определенном складе"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'offer', description: 'ID товарного предложения'})
	@ApiParam({name: 'store', description: 'ID склада'})
	async delete(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('offer', ParseBigIntPipe) offer: bigint, @Param('store', ParseIntPipe) store: number) {
		return await super.delete(actor, catalog, offer, store);
	}
	
	
}