/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/controllers/offer-prices.controller
 * in a proper way.
 */
import { AuthInfo } from './../../../decorators/auth.decorator';
import { ApiKeys } from './../../../entities/ApiKeys';
import { CreateOfferPriceDto } from './../../dtos/create-offer-price.dto';
import { UpdateOfferPriceDto } from './../../dtos/update-offer-price.dto';
import { CatalogProductOffersService } from './../../services/catalog-product-offers.service';
import { CatalogsService } from './../../services/catalogs.service';
import { OfferPricesService } from './../../services/offer-prices.service';
import { PriceTypesService } from './../../services/price-types.service';
import { RatesService } from './../../services/rates.service';
import { EntityManager } from '@mikro-orm/postgresql';
import { Controller, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiHeader, ApiTags } from '@nestjs/swagger';

@ApiHeader({ name: 'X-API-KEY', required: true, description: 'Ваш идентефикатор апи' })
@UseGuards(AuthGuard('api-key'))
@ApiTags('Offer prices')
@Controller('catalog/:catalog/offer/:offer/price')
export class GenOfferPricesController {
	constructor(
		protected readonly catalogProductOffersService: CatalogProductOffersService,
		protected readonly catalogsService: CatalogsService,
		protected readonly offerPricesService: OfferPricesService,
		protected readonly priceTypesService: PriceTypesService,
		protected readonly ratesService: RatesService,
	) { }
	
	async findAll(apiKey: ApiKeys, catalog: number, offer: bigint) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		const offerIns = await this.catalogProductOffersService.findById(offer);
		if(offerIns===null || !(offerIns.catalog.id===catalog)){
			throw new HttpException('Offer not found', HttpStatus.NOT_FOUND);
		}
		return await this.offerPricesService.findAllByOffer(offer);
	}
	
	async findOne(apiKey: ApiKeys, catalog: number, offer: bigint, priceType: number) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		const entity = await this.offerPricesService.findByOfferAndPriceType(offer, priceType);
		if(entity===null){
			throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
		}
		await this.validateRead(entity, apiKey, catalog, offer, priceType);
		return entity;
	}
	
	async validateRead(entity, apiKey: ApiKeys, catalog: number, offer: bigint, priceType: number) { }
	
	async update(apiKey: ApiKeys, catalog: number, offer: bigint, priceType: number, updateDto: UpdateOfferPriceDto) {
		updateDto.offer = offer;
		updateDto.priceType = priceType;
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		return await this.offerPricesService.transactional(async (em) => {
			const entity = await this.offerPricesService.findByOfferAndPriceType(offer, priceType, em);
			const priceTypeIns = await this.priceTypesService.findById(priceType);
			if(priceTypeIns===null || !(priceTypeIns.company.id===apiKey.company.id)){
				throw new HttpException('Price type not found', HttpStatus.NOT_FOUND);
			}
			const offerIns = await this.catalogProductOffersService.findById(offer);
			if(offerIns===null || !(offerIns.catalog.id===catalog)){
				throw new HttpException('Offer not found', HttpStatus.NOT_FOUND);
			}
			await this.validateUpdate(entity, apiKey, catalog, offer, priceType, updateDto, em);
			if(entity!==null){
				return await this.offerPricesService.update(entity, updateDto, em);
			} else {
				return await this.offerPricesService.create(updateDto, em);
			}
		});
	}
	
	async validateUpdate(entity, apiKey: ApiKeys, catalog: number, offer: bigint, priceType: number, updateDto: UpdateOfferPriceDto, em: EntityManager) { }
	
	async delete(apiKey: ApiKeys, catalog: number, offer: bigint, priceType: number) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		return await this.offerPricesService.transactional(async (em) => {
			const entity = await this.offerPricesService.findByOfferAndPriceType(offer, priceType, em);
			if(entity===null){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			await this.validateDelete(entity, apiKey, catalog, offer, priceType, em);
			return await this.offerPricesService.remove(entity, em);
		});
	}
	
	async validateDelete(entity, apiKey: ApiKeys, catalog: number, offer: bigint, priceType: number, em: EntityManager) { }
	
}