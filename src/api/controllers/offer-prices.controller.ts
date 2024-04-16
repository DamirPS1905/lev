import { AuthInfo } from './../../decorators/auth.decorator'
import { Actors } from './../../entities/Actors'
import { CreateOfferPriceDto } from './../dtos/create-offer-price.dto'
import { UpdateOfferPriceDto } from './../dtos/update-offer-price.dto'
import { OfferPricesService } from './../services/offer-prices.service'
import { GenOfferPricesController } from './gen/offer-prices.controller'
import { EntityManager } from '@mikro-orm/postgresql'
import { Body, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ParseBigIntPipe } from './../../pipes/parse-bigint.pipe'
import { ApiOperation, ApiParam } from '@nestjs/swagger'

export class OfferPricesController extends GenOfferPricesController {
	
	@Get('all')
	@ApiOperation({summary: "Получение всех цен товарного предложения"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'offer', description: 'ID товарного предложения'})
	async findAll(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('offer', ParseBigIntPipe) offer: bigint) {
		return await super.findAll(actor, catalog, offer);
	}
	
	@Get(':priceType')
	@ApiOperation({summary: "Получение цены товарного предложения определенного типа"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'offer', description: 'ID товарного предложения'})
	@ApiParam({name: 'priceType', description: 'ID типа цены'})
	async findOne(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('offer', ParseBigIntPipe) offer: bigint, @Param('priceType', ParseIntPipe) priceType: number) {
		return await super.findOne(actor, catalog, offer, priceType);
	}
	
	@Patch(':priceType')
	@ApiOperation({summary: "Задание или обновлене цены товарного предложения определенного типа"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'offer', description: 'ID товарного предложения'})
	@ApiParam({name: 'priceType', description: 'ID типа цены'})
	async update(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('offer', ParseBigIntPipe) offer: bigint, @Param('priceType', ParseIntPipe) priceType: number, @Body() updateDto: UpdateOfferPriceDto) {
		return await super.update(actor, catalog, offer, priceType, updateDto);
	}
	
	async validateUpdate(entity, actor: Actors, catalog: number, offer: bigint, priceType: number, updateDto: UpdateOfferPriceDto, em: EntityManager) {
		try{
			const priceTypeIns = await this.priceTypesService.findById(priceType, em);
			if(updateDto.currency===undefined || updateDto.currency===priceTypeIns.baseCurrency.id){
				updateDto.index = updateDto.value;
			}else{
				updateDto.index = (parseFloat(updateDto.value)*(await this.ratesService.getRate(updateDto.currency, priceTypeIns.baseCurrency.id))).toFixed(2);
			}
			updateDto.updatedAt = new Date();
		}catch(e){
			throw new HttpException(e.message, HttpStatus.CONFLICT);
		}
	}
	
	@Delete(':priceType')
	@ApiOperation({summary: "Удаление цены товарного предложения определенного типа"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'offer', description: 'ID товарного предложения'})
	@ApiParam({name: 'priceType', description: 'ID типа цены'})
	async delete(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('offer', ParseBigIntPipe) offer: bigint, @Param('priceType', ParseIntPipe) priceType: number) {
		return await super.delete(actor, catalog, offer, priceType);
	}
	
	
}