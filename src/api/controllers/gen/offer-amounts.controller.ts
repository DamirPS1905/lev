/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/controllers/offer-amounts.controller
 * in a proper way.
 */
import { AuthInfo } from './../../../decorators/auth.decorator'
import { ApiKeys } from './../../../entities/ApiKeys'
import { CreateOfferAmountDto } from './../../dtos/create-offer-amount.dto'
import { UpdateOfferAmountDto } from './../../dtos/update-offer-amount.dto'
import { CatalogProductOffersService } from './../../services/catalog-product-offers.service'
import { CatalogsService } from './../../services/catalogs.service'
import { OfferAmountsService } from './../../services/offer-amounts.service'
import { StoresService } from './../../services/stores.service'
import { EntityManager } from '@mikro-orm/postgresql'
import { Controller, HttpException, HttpStatus, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiHeader, ApiTags } from '@nestjs/swagger'

@ApiHeader({ name: 'X-API-KEY', required: true })
@UseGuards(AuthGuard('api-key'))
@ApiTags('Offer amounts')
@Controller('catalog/:catalog/offer/:offer/store')
export class GenOfferAmountsController {
	constructor(
		protected readonly catalogProductOffersService: CatalogProductOffersService,
		protected readonly catalogsService: CatalogsService,
		protected readonly offerAmountsService: OfferAmountsService,
		protected readonly storesService: StoresService,
	) { }
	
	async findAll(apiKey: ApiKeys, offer: bigint, offset: number, limit: number, catalog: number) {
		const catalogIns1 = await this.catalogsService.findById(catalog);
		if(catalogIns1===null || !(catalogIns1.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		const offerIns0 = await this.catalogProductOffersService.findById(offer);
		if(offerIns0===null || !(offerIns0.product.catalog.id===catalog)){
			throw new HttpException('Offer not found', HttpStatus.NOT_FOUND);
		}
		if(offset<0) throw new HttpException('Wrong offset value', HttpStatus.BAD_REQUEST);
		if(limit<0) throw new HttpException('Wrong limit value', HttpStatus.BAD_REQUEST);
		if(limit>1000) limit = 1000;
		return await this.offerAmountsService.listByOffer(offer, offset, limit);
	}
	
	async findOne(apiKey: ApiKeys, catalog: number, offer: bigint, store: number) {
		const catalogIns0 = await this.catalogsService.findById(catalog);
		if(catalogIns0===null || !(catalogIns0.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		const entity = await this.offerAmountsService.findByOfferAndStore(offer, store);
		if(entity===null || !(entity.offer.product.catalog.id===catalog)){
			throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
		}
		await this.validateRead(entity, apiKey, catalog, offer, store);
		return entity;
	}
	
	async validateRead(entity, apiKey: ApiKeys, catalog: number, offer: bigint, store: number) { }
	
	async update(apiKey: ApiKeys, catalog: number, offer: bigint, store: number, updateDto: UpdateOfferAmountDto) {
		updateDto.offer = offer;
		updateDto.store = store;
		const catalogIns0 = await this.catalogsService.findById(catalog);
		if(catalogIns0===null || !(catalogIns0.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		return await this.offerAmountsService.transactional(async (em) => {
			const entity = await this.offerAmountsService.findByOfferAndStore(offer, store, em);
			const storeIns1 = await this.storesService.findById(updateDto.store);
			if(storeIns1===null || !(storeIns1.company.id===apiKey.company.id)){
				throw new HttpException('Store not found', HttpStatus.NOT_FOUND);
			}
			const offerIns2 = await this.catalogProductOffersService.findById(updateDto.offer);
			if(offerIns2===null || !(offerIns2.product.catalog.id===catalog)){
				throw new HttpException('Offer not found', HttpStatus.NOT_FOUND);
			}
			await this.validateUpdate(entity, apiKey, catalog, offer, store, updateDto);
			if(entity!==null){
				if(!(entity.offer.product.catalog.id===catalog)){
					throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
				}
				return await this.offerAmountsService.update(entity, updateDto, em);
			} else {
				return await this.offerAmountsService.create(updateDto, em);
			}
		});
	}
	
	async validateUpdate(entity, apiKey: ApiKeys, catalog: number, offer: bigint, store: number, updateDto: UpdateOfferAmountDto) { }
	
	async delete(apiKey: ApiKeys, catalog: number, offer: bigint, store: number) {
		const catalogIns0 = await this.catalogsService.findById(catalog);
		if(catalogIns0===null || !(catalogIns0.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		return await this.offerAmountsService.transactional(async (em) => {
			const entity = await this.offerAmountsService.findByOfferAndStore(offer, store, em);
			if(entity===null || !(entity.offer.product.catalog.id===catalog)){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			await this.validateDelete(entity, apiKey, catalog, offer, store, em);
			return await this.offerAmountsService.remove(entity, em);
		});
	}
	
	async validateDelete(entity, apiKey: ApiKeys, catalog: number, offer: bigint, store: number, em: EntityManager) { }
	
}