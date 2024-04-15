/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/controllers/offer-amounts.controller
 * in a proper way.
 */
import { AuthInfo } from './../../../decorators/auth.decorator';
import { Actors } from './../../../entities/Actors';
import { CreateOfferAmountDto } from './../../dtos/create-offer-amount.dto';
import { UpdateOfferAmountDto } from './../../dtos/update-offer-amount.dto';
import { CatalogProductOffersService } from './../../services/catalog-product-offers.service';
import { CatalogsService } from './../../services/catalogs.service';
import { OfferAmountsService } from './../../services/offer-amounts.service';
import { StoresService } from './../../services/stores.service';
import { EntityManager } from '@mikro-orm/postgresql';
import { Controller, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiHeader, ApiTags } from '@nestjs/swagger';

@ApiHeader({ name: 'X-API-KEY', required: true, description: 'Ваш идентефикатор апи' })
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
	
	async findAll(actor: Actors, catalog: number, offer: bigint) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===actor.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		const offerIns = await this.catalogProductOffersService.findById(offer);
		if(offerIns===null || !(offerIns.product.catalog.id===catalog)){
			throw new HttpException('Offer not found', HttpStatus.NOT_FOUND);
		}
		return await this.offerAmountsService.findAllByOffer(offer);
	}
	
	async findOne(actor: Actors, catalog: number, offer: bigint, store: number) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===actor.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		const entity = await this.offerAmountsService.findByOfferAndStore(offer, store);
		if(entity===null || !(entity.offer.product.catalog.id===catalog)){
			throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
		}
		await this.validateRead(entity, actor, catalog, offer, store);
		return entity;
	}
	
	async validateRead(entity, actor: Actors, catalog: number, offer: bigint, store: number) { }
	
	async update(actor: Actors, catalog: number, offer: bigint, store: number, updateDto: UpdateOfferAmountDto) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===actor.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		return await this.offerAmountsService.transactional(async (em) => {
			const entity = await this.offerAmountsService.findByOfferAndStore(offer, store, em);
			const storeIns = await this.storesService.findById(store);
			if(storeIns===null || !(storeIns.company.id===actor.company.id)){
				throw new HttpException('Store not found', HttpStatus.NOT_FOUND);
			}
			const offerIns = await this.catalogProductOffersService.findById(offer);
			if(offerIns===null || !(offerIns.product.catalog.id===catalog)){
				throw new HttpException('Offer not found', HttpStatus.NOT_FOUND);
			}
			await this.validateUpdate(entity, actor, catalog, offer, store, updateDto, em);
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
	
	async validateUpdate(entity, actor: Actors, catalog: number, offer: bigint, store: number, updateDto: UpdateOfferAmountDto, em: EntityManager) { }
	
	async delete(actor: Actors, catalog: number, offer: bigint, store: number) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===actor.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		return await this.offerAmountsService.transactional(async (em) => {
			const entity = await this.offerAmountsService.findByOfferAndStore(offer, store, em);
			if(entity===null || !(entity.offer.product.catalog.id===catalog)){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			await this.validateDelete(entity, actor, catalog, offer, store, em);
			return await this.offerAmountsService.remove(entity, em);
		});
	}
	
	async validateDelete(entity, actor: Actors, catalog: number, offer: bigint, store: number, em: EntityManager) { }
	
}