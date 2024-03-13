/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/controllers/offer-property-values.controller
 * in a proper way.
 */
import { AuthInfo } from './../../../decorators/auth.decorator'
import { ApiKeys } from './../../../entities/ApiKeys'
import { CreateOfferPropertyValueDto } from './../../dtos/create-offer-property-value.dto'
import { UpdateOfferPropertyValueDto } from './../../dtos/update-offer-property-value.dto'
import { CatalogProductOffersService } from './../../services/catalog-product-offers.service'
import { CatalogProductsService } from './../../services/catalog-products.service'
import { CatalogPropertiesService } from './../../services/catalog-properties.service'
import { CatalogsService } from './../../services/catalogs.service'
import { OfferPropertyValuesService } from './../../services/offer-property-values.service'
import { EntityManager } from '@mikro-orm/postgresql'
import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiHeader, ApiTags } from '@nestjs/swagger'

@ApiHeader({ name: 'X-API-KEY', required: true })
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
	) { }
	
	@Get('property/:property')
	async findOne(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('product') product: bigint, @Param('offer') offer: bigint, @Param('property', ParseIntPipe) property: number) {
		const catalogIns0 = await this.catalogsService.findById(catalog);
		if(catalogIns0===null || !(catalogIns0.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		const productIns1 = await this.catalogProductsService.findById(product);
		if(productIns1===null || !(productIns1.catalog.id===catalog)){
			throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
		}
		const entity = await this.offerPropertyValuesService.findByOfferAndProperty(offer, property);
		if(entity===null){
			throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
		}
		this.validateRead(entity, apiKey, catalog, product, offer, property);
		return entity;
	}
	
	validateRead(entity, apiKey: ApiKeys, catalog: number, product: bigint, offer: bigint, property: number) { }
	
	@Patch('property/:property')
	async update(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('product') product: bigint, @Param('offer') offer: bigint, @Param('property', ParseIntPipe) property: number, @Body() updateDto: UpdateOfferPropertyValueDto) {
		updateDto.offer = offer;
		updateDto.property = property;
		const catalogIns0 = await this.catalogsService.findById(catalog);
		if(catalogIns0===null || !(catalogIns0.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		const productIns1 = await this.catalogProductsService.findById(product);
		if(productIns1===null || !(productIns1.catalog.id===catalog)){
			throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
		}
		return await this.offerPropertyValuesService.transactional(async (em) => {
			const entity = await this.offerPropertyValuesService.findByOfferAndProperty(offer, property, em);
			if((updateDto.property!==undefined && updateDto.property!==entity.property.id)){
				const propertyIns2 = await this.catalogPropertiesService.findById(updateDto.property);
				if(propertyIns2===null || !(propertyIns2.catalog.id===catalog)){
					throw new HttpException('Property not found', HttpStatus.NOT_FOUND);
				}
			}
			if((updateDto.offer!==undefined && updateDto.offer!==entity.offer.id)){
				const offerIns3 = await this.catalogProductOffersService.findById(updateDto.offer);
				if(offerIns3===null || !(offerIns3.product.id===product)){
					throw new HttpException('Offer not found', HttpStatus.NOT_FOUND);
				}
			}
			this.validateUpdate(entity, apiKey, catalog, product, offer, property, updateDto, em);
			if(entity===null){
				return await this.offerPropertyValuesService.update(entity, updateDto, em);
			} else {
				return await this.offerPropertyValuesService.create(updateDto, em);
			}
		});
	}
	
	validateUpdate(entity, apiKey: ApiKeys, catalog: number, product: bigint, offer: bigint, property: number, updateDto: UpdateOfferPropertyValueDto, em: EntityManager) { }
	
	@Delete('property/:property')
	async delete(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('product') product: bigint, @Param('offer') offer: bigint, @Param('property', ParseIntPipe) property: number) {
		const catalogIns0 = await this.catalogsService.findById(catalog);
		if(catalogIns0===null || !(catalogIns0.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		const productIns1 = await this.catalogProductsService.findById(product);
		if(productIns1===null || !(productIns1.catalog.id===catalog)){
			throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
		}
		return await this.offerPropertyValuesService.transactional(async (em) => {
			const entity = await this.offerPropertyValuesService.findByOfferAndProperty(offer, property, em);
			if(entity===null){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			this.validateDelete(entity, apiKey, catalog, product, offer, property, em);
			return await this.offerPropertyValuesService.remove(entity, em);
		});
	}
	
	validateDelete(entity, apiKey: ApiKeys, catalog: number, product: bigint, offer: bigint, property: number, em: EntityManager) { }
	
}