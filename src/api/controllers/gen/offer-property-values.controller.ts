/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/controllers/offer-property-values.controller
 * in a proper way.
 */
import { AuthInfo } from './../../../decorators/auth.decorator';
import { Actors } from './../../../entities/Actors';
import { CreateOfferPropertyValueDto } from './../../dtos/create-offer-property-value.dto';
import { UpdateOfferPropertyValueDto } from './../../dtos/update-offer-property-value.dto';
import { CatalogProductOffersService } from './../../services/catalog-product-offers.service';
import { CatalogProductsService } from './../../services/catalog-products.service';
import { CatalogPropertiesService } from './../../services/catalog-properties.service';
import { CatalogsService } from './../../services/catalogs.service';
import { OfferPropertyValuesService } from './../../services/offer-property-values.service';
import { PropertyTypesService } from './../../services/property-types.service';
import { FsPatch } from './../../services/special/files.service';
import { EntityManager } from '@mikro-orm/postgresql';
import { Controller, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiHeader, ApiTags } from '@nestjs/swagger';

@ApiHeader({ name: 'X-API-KEY', required: true, description: 'Ваш идентефикатор апи' })
@UseGuards(AuthGuard('api-key'))
@ApiTags('Offer property values')
@Controller('catalog/:catalog/product/:product/offer/:offer')
export class GenOfferPropertyValuesController {
	constructor(
		protected readonly catalogProductOffersService: CatalogProductOffersService,
		protected readonly catalogProductsService: CatalogProductsService,
		protected readonly catalogPropertiesService: CatalogPropertiesService,
		protected readonly catalogsService: CatalogsService,
		protected readonly offerPropertyValuesService: OfferPropertyValuesService,
		protected readonly propertyTypesService: PropertyTypesService,
	) { }
	
	async findAll(actor: Actors, catalog: number, product: bigint, offset: number, limit: number) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===actor.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		const productIns = await this.catalogProductsService.findById(product);
		if(productIns===null || !(productIns.catalog.id===catalog)){
			throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
		}
		if(offset<0) throw new HttpException('Wrong offset value', HttpStatus.BAD_REQUEST);
		if(limit<0) throw new HttpException('Wrong limit value', HttpStatus.BAD_REQUEST);
		if(limit>1000) limit = 1000;
		return await this.offerPropertyValuesService.listAll(offset, limit);
	}
	
	async findOne(actor: Actors, catalog: number, product: bigint, offer: bigint, property: number, order: number) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===actor.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		const productIns = await this.catalogProductsService.findById(product);
		if(productIns===null || !(productIns.catalog.id===catalog)){
			throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
		}
		const entity = await this.offerPropertyValuesService.findByOfferAndPropertyAndOrder(offer, property, order);
		if(entity===null){
			throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
		}
		await this.validateRead(entity, actor, catalog, product, offer, property, order);
		return entity;
	}
	
	async validateRead(entity, actor: Actors, catalog: number, product: bigint, offer: bigint, property: number, order: number) { }
	
	async update(actor: Actors, catalog: number, product: bigint, offer: bigint, property: number, order: number, updateDto: UpdateOfferPropertyValueDto) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===actor.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		const productIns = await this.catalogProductsService.findById(product);
		if(productIns===null || !(productIns.catalog.id===catalog)){
			throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
		}
		return await this.offerPropertyValuesService.transactional(async (em, fm) => {
			const entity = await this.offerPropertyValuesService.findByOfferAndPropertyAndOrder(offer, property, order, em);
			const offerIns = await this.catalogProductOffersService.findById(offer);
			if(offerIns===null || !(offerIns.product.id===product)){
				throw new HttpException('Offer not found', HttpStatus.NOT_FOUND);
			}
			const propertyIns = await this.catalogPropertiesService.findById(property);
			if(propertyIns===null || !(propertyIns.catalog.id===catalog)){
				throw new HttpException('Property not found', HttpStatus.NOT_FOUND);
			}
			await this.validateUpdate(entity, actor, catalog, product, offer, property, order, updateDto, em, fm);
			if(entity!==null){
				const result = await this.offerPropertyValuesService.update(entity, updateDto, em);
				await this.afterUpdate(entity, actor, catalog, product, offer, property, order, updateDto, em, fm);
				return result;
			} else {
				const result = await this.offerPropertyValuesService.create(updateDto, em);
				await this.afterUpdate(entity, actor, catalog, product, offer, property, order, updateDto, em, fm);
				return result;
			}
		});
	}
	
	async validateUpdate(entity, actor: Actors, catalog: number, product: bigint, offer: bigint, property: number, order: number, updateDto: UpdateOfferPropertyValueDto, em: EntityManager, fm: FsPatch) { }
	async afterUpdate(entity, actor: Actors, catalog: number, product: bigint, offer: bigint, property: number, order: number, updateDto: UpdateOfferPropertyValueDto, em: EntityManager, fm: FsPatch) { }
	
	async delete(actor: Actors, catalog: number, product: bigint, offer: bigint, property: number, order: number) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===actor.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		const productIns = await this.catalogProductsService.findById(product);
		if(productIns===null || !(productIns.catalog.id===catalog)){
			throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
		}
		return await this.offerPropertyValuesService.transactional(async (em, fm) => {
			const entity = await this.offerPropertyValuesService.findByOfferAndPropertyAndOrder(offer, property, order, em);
			if(entity===null){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			await this.validateDelete(entity, actor, catalog, product, offer, property, order, em, fm);
			await this.offerPropertyValuesService.remove(entity, em);
			await this.afterDelete(entity, actor, catalog, product, offer, property, order, em, fm);
		});
	}
	
	async validateDelete(entity, actor: Actors, catalog: number, product: bigint, offer: bigint, property: number, order: number, em: EntityManager, fm: FsPatch) { }
	async afterDelete(entity, actor: Actors, catalog: number, product: bigint, offer: bigint, property: number, order: number, em: EntityManager, fm: FsPatch) { }
	
}