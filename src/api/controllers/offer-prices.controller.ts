import { AuthInfo } from './../../decorators/auth.decorator'
import { Actors } from './../../entities/Actors'
import { CreateOfferPriceDto } from './../dtos/create-offer-price.dto'
import { UpdateOfferPriceDto } from './../dtos/update-offer-price.dto'
import { OfferPricesService } from './../services/offer-prices.service'
import { GenOfferPricesController } from './gen/offer-prices.controller'
import { EntityManager } from '@mikro-orm/postgresql'
import { Controller, DefaultValuePipe, ParseEnumPipe, UseGuards, Body, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Query } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ParseBigIntPipe } from './../../pipes/parse-bigint.pipe'
import { ApiQuery, ApiOperation, ApiParam } from '@nestjs/swagger'
import { refill } from './../../util/utils';

export class OfferPricesController extends GenOfferPricesController {
		
	@Get('offer/:offer/price/all')
	@ApiOperation({summary: "Получение всех цен товарных предложений"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'offer', description: 'ID товарного предложения'})
	async findAll(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('offer', ParseBigIntPipe) offer: bigint) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===actor.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		const offerIns = await this.catalogProductOffersService.findById(offer);
		if(offerIns===null || !(offerIns.catalog.id===catalog)){
			throw new HttpException('Offer not found', HttpStatus.NOT_FOUND);
		}
		return await this.offerPricesService.findActualByOffer(offer);
	}
	
	@Get('price/:priceType/offers/all')
	@ApiOperation({summary: "Получение изменившихся цен определенного типа товарных предложений в каталоге"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'priceType', description: 'ID типа цены'})
	@ApiQuery({name: 'limit', description: 'Maximum count of returning entities', required: false})
	@ApiQuery({ name: 'offset', description: 'Count of skipping entities', required: false})
	async findAllByType(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('priceType', ParseIntPipe) priceType: number, @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number, @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number) {
		if(offset<0) throw new HttpException('Wrong offset value', HttpStatus.BAD_REQUEST);
		if(limit<0) throw new HttpException('Wrong limit value', HttpStatus.BAD_REQUEST);
		if(limit>5000) limit = 5000;
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===actor.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		const priceTypeIns = await this.priceTypesService.findById(priceType);
		if(priceTypeIns===null || !(priceTypeIns.company.id===actor.company.id)){
			throw new HttpException('Price type not found', HttpStatus.NOT_FOUND);
		}
		return await this.offerPricesService.listActualByPriceTypeAndCatalog(priceType, catalog, offset, limit);
	}
	
	@Get('price/:priceType/offers/updates-from/:version')
	@ApiOperation({summary: "Получение цен определенного типа товарных предложений в каталоге"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'priceType', description: 'ID типа цены'})
	@ApiParam({name: 'version', description: 'Последняя версия цен товаров полученная от апи'})
	@ApiQuery({name: 'limit', description: 'Maximum count of returning entities', required: false})
	async findNewByType(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('priceType', ParseIntPipe) priceType: number, @Param('version', ParseBigIntPipe) version: bigint, @Query('limit', new DefaultValuePipe(1000), ParseIntPipe) limit: number) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===actor.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		const priceTypeIns = await this.priceTypesService.findById(priceType);
		if(priceTypeIns===null || !(priceTypeIns.company.id===actor.company.id)){
			throw new HttpException('Price type not found', HttpStatus.NOT_FOUND);
		}
		if(limit<0) throw new HttpException('Wrong limit value', HttpStatus.BAD_REQUEST);
		if(limit>5000) limit = 5000;
		return await this.offerPricesService.findNewByPriceTypeAndCatalog(priceType, catalog, version, limit);
	}
	
	@Get('offers/updates-from/:version')
	@ApiOperation({summary: "Получение цен определенного типа товарных предложений в каталоге"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'version', description: 'Последняя версия цен товаров полученная от апи'})
	@ApiQuery({name: 'limit', description: 'Maximum count of returning entities', required: false})
	async findNew(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('version', ParseBigIntPipe) version: bigint, @Query('limit', new DefaultValuePipe(1000), ParseIntPipe) limit: number) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===actor.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		if(limit<0) throw new HttpException('Wrong limit value', HttpStatus.BAD_REQUEST);
		if(limit>5000) limit = 5000;
		return await this.offerPricesService.findNewByCatalog(catalog, version, limit);
	}
	
	@Get('offer/:offer/price/:priceType')
	@ApiOperation({summary: "Получение цены товарного предложения определенного типа"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'offer', description: 'ID товарного предложения'})
	@ApiParam({name: 'priceType', description: 'ID типа цены'})
	async findOne(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('offer', ParseBigIntPipe) offer: bigint, @Param('priceType', ParseIntPipe) priceType: number) {
		return await super.findOne(actor, catalog, offer, priceType);
	}
	
	async validateRead(entity, actor: Actors, catalog: number, offer: bigint, priceType: number){
		if(entity.deleted){
			throw new HttpException('Product offer price not found', HttpStatus.NOT_FOUND);
		}
	}
		
	@Patch('offer/:offer/price/:priceType')
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
		updateDto.deleted = false;
	}
	
	@Delete('offer/:offer/price/:priceType')
	@ApiOperation({summary: "Удаление цены товарного предложения определенного типа"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'offer', description: 'ID товарного предложения'})
	@ApiParam({name: 'priceType', description: 'ID типа цены'})
	async delete(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('offer', ParseBigIntPipe) offer: bigint, @Param('priceType', ParseIntPipe) priceType: number) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===actor.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		const offerIns = await this.catalogProductOffersService.findById(offer);
		if(offerIns===null || !(offerIns.catalog.id===catalog)){
			throw new HttpException('Offer not found', HttpStatus.NOT_FOUND);
		}
		return await this.offerPricesService.transactional(async (em, fm) => {
			const entity = await this.offerPricesService.findByOfferAndPriceType(offer, priceType, em);
			if(entity===null || entity.deleted){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			await this.offerPricesService.update(entity, refill(UpdateOfferPriceDto, {deleted: true}), em);
		});
	}
	
	
}