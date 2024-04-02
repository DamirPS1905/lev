/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/controllers/offers-prices.controller
 * in a proper way.
 */
import { AuthInfo } from './../../../decorators/auth.decorator'
import { ApiKeys } from './../../../entities/ApiKeys'
import { CreateOffersPriceDto } from './../../dtos/create-offers-price.dto'
import { UpdateOffersPriceDto } from './../../dtos/update-offers-price.dto'
import { CatalogProductOffersService } from './../../services/catalog-product-offers.service'
import { CatalogsService } from './../../services/catalogs.service'
import { OffersPricesService } from './../../services/offers-prices.service'
import { PriceTypesService } from './../../services/price-types.service'
import { EntityManager } from '@mikro-orm/postgresql'
import { Controller, HttpException, HttpStatus, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiHeader, ApiTags } from '@nestjs/swagger'

@ApiHeader({ name: 'X-API-KEY', required: true })
@UseGuards(AuthGuard('api-key'))
@ApiTags('Offers prices')
@Controller('catalog/:catalog/offer/:offer/price')
export class GenOffersPricesController {
	constructor(
		protected readonly catalogProductOffersService: CatalogProductOffersService,
		protected readonly catalogsService: CatalogsService,
		protected readonly offersPricesService: OffersPricesService,
		protected readonly priceTypesService: PriceTypesService,
	) { }
	
	async findAll(apiKey: ApiKeys, catalog: number, offset: number, limit: number) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		if(offset<0) throw new HttpException('Wrong offset value', HttpStatus.BAD_REQUEST);
		if(limit<0) throw new HttpException('Wrong limit value', HttpStatus.BAD_REQUEST);
		if(limit>1000) limit = 1000;
		return await this.offersPricesService.listAll(offset, limit);
	}
	
	async findOne(apiKey: ApiKeys, catalog: number, offer: bigint, priceType: number) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		const entity = await this.offersPricesService.findByOfferAndPriceType(offer, priceType);
		if(entity===null){
			throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
		}
		await this.validateRead(entity, apiKey, catalog, offer, priceType);
		return entity;
	}
	
	async validateRead(entity, apiKey: ApiKeys, catalog: number, offer: bigint, priceType: number) { }
	
	async update(apiKey: ApiKeys, catalog: number, offer: bigint, priceType: number, updateDto: UpdateOffersPriceDto) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		return await this.offersPricesService.transactional(async (em) => {
			const entity = await this.offersPricesService.findByOfferAndPriceType(offer, priceType, em);
			const priceTypeIns = await this.priceTypesService.findById(priceType);
			if(priceTypeIns===null || !(priceTypeIns.company.id===apiKey.company.id)){
				throw new HttpException('Price type not found', HttpStatus.NOT_FOUND);
			}
			const offerIns = await this.catalogProductOffersService.findById(offer);
			if(offerIns===null || !(offerIns.product.catalog.id===catalog)){
				throw new HttpException('Offer not found', HttpStatus.NOT_FOUND);
			}
			await this.validateUpdate(entity, apiKey, catalog, offer, priceType, updateDto, em);
			if(entity!==null){
				return await this.offersPricesService.update(entity, updateDto, em);
			} else {
				return await this.offersPricesService.create(updateDto, em);
			}
		});
	}
	
	async validateUpdate(entity, apiKey: ApiKeys, catalog: number, offer: bigint, priceType: number, updateDto: UpdateOffersPriceDto, em: EntityManager) { }
	
	async delete(apiKey: ApiKeys, catalog: number, offer: bigint, priceType: number) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		return await this.offersPricesService.transactional(async (em) => {
			const entity = await this.offersPricesService.findByOfferAndPriceType(offer, priceType, em);
			if(entity===null){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			await this.validateDelete(entity, apiKey, catalog, offer, priceType, em);
			return await this.offersPricesService.remove(entity, em);
		});
	}
	
	async validateDelete(entity, apiKey: ApiKeys, catalog: number, offer: bigint, priceType: number, em: EntityManager) { }
	
}