import { AuthInfo } from './../../decorators/auth.decorator'
import { ApiKeys } from './../../entities/ApiKeys'
import { CreateOfferPriceDto } from './../dtos/create-offer-price.dto'
import { UpdateOfferPriceDto } from './../dtos/update-offer-price.dto'
import { OfferPricesService } from './../services/offer-prices.service'
import { GenOfferPricesController } from './gen/offer-prices.controller'
import { EntityManager } from '@mikro-orm/postgresql'
import { Body, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

export class OfferPricesController extends GenOfferPricesController {
	
	@Get('all')
	async findAll(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('offer') offer: bigint) {
		return await super.findAll(apiKey, catalog, offer);
	}
	
	@Get(':priceType')
	async findOne(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('offer') offer: bigint, @Param('priceType', ParseIntPipe) priceType: number) {
		return await super.findOne(apiKey, catalog, offer, priceType);
	}
	
	@Patch(':priceType')
	async update(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('offer') offer: bigint, @Param('priceType', ParseIntPipe) priceType: number, @Body() updateDto: UpdateOfferPriceDto) {
		return await super.update(apiKey, catalog, offer, priceType, updateDto);
	}
	
	async validateUpdate(entity, apiKey: ApiKeys, catalog: number, offer: bigint, priceType: number, updateDto: UpdateOfferPriceDto, em: EntityManager) {
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
	async delete(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('offer') offer: bigint, @Param('priceType', ParseIntPipe) priceType: number) {
		return await super.delete(apiKey, catalog, offer, priceType);
	}
	
	
}