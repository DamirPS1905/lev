import { AuthInfo } from './../../decorators/auth.decorator'
import { ApiKeys } from './../../entities/ApiKeys'
import { CreateOfferPropertyValueDto } from './../dtos/create-offer-property-value.dto'
import { UpdateOfferPropertyValueDto } from './../dtos/update-offer-property-value.dto'
import { OfferPropertyValuesService } from './../services/offer-property-values.service'
import { EntityManager, wrap } from '@mikro-orm/postgresql'
import { Body, Controller, DefaultValuePipe, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Query } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiQuery, ApiTags, ApiExtraModels, ApiBody } from '@nestjs/swagger'
import { PropertyInTypesService } from './../services/property-in-types.service'
import { CatalogsService } from './../services/catalogs.service'
import { OptionsPropertyValuesService } from './../services/options-property-values.service'
import { PropertyTypesService } from './../services/property-types.service'
import { CatalogProductOffersService } from './../services/catalog-product-offers.service'
import { IMetatypeVauesService } from './../services/interface/i-metatype-values.service'
import { AbstractValuesController } from './abstract/abstract-values.controller'
import { ParseBigIntPipe } from './../../pipes/parse-bigint.pipe'

@ApiTags('Offers property values')
@Controller('catalog/:catalog/offer/:offer')
export class OfferPropertyValuesController extends AbstractValuesController<bigint, OfferPropertyValuesService> {
	
	constructor(
		protected readonly propertyInTypesService: PropertyInTypesService,
		catalogsService: CatalogsService,
		optionsPropertyValuesService: OptionsPropertyValuesService,
		propertyTypesService: PropertyTypesService,
		valuesService: OfferPropertyValuesService,
		protected readonly catalogProductOffersService: CatalogProductOffersService
	){
		super(
			"OfferPropertyValues",
			catalogsService,
			optionsPropertyValuesService,
			propertyTypesService,
			valuesService
		)
	}

	protected async validateInstance(catalog:number, instance:bigint, em:EntityManager = null){
		const productOfferIns = await this.catalogProductOffersService.findById(instance, em);
		if(productOfferIns===null || productOfferIns.catalog.id!==catalog){
			throw new HttpException('Product not found', HttpStatus.NOT_FOUND);			
		}
	}
	
	protected async validateAttachment(catalog: number, property: number, instance: bigint, em: EntityManager = null){
		const productOfferIns = await this.catalogProductOffersService.findById(instance, em);
		await wrap(productOfferIns.product).init();
		const propertyInType = await this.propertyInTypesService.getParentsPropertyByChild(property, productOfferIns.product.type.id, em);
		if(propertyInType===null){
			throw new HttpException('Property not found', HttpStatus.NOT_FOUND);			
		}
		await wrap(propertyInType.property).init();
		return [propertyInType.property, propertyInType.scheme];
	}
	
	@Get('property/all')
	async findAll(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('offer', ParseBigIntPipe) offer: bigint) {
		return await super.findAll(apiKey, catalog, offer);
	}
	
	@Get('property/:property')
	async findOne(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('offer', ParseBigIntPipe) offer: bigint, @Param('property', ParseIntPipe) property: number) {
		return await super.findOne(apiKey, catalog, offer, property);
	}
	
	@ApiExtraModels(Object, Array<Object>)
	@ApiBody({
	  schema: {
	    oneOf: [
	      {type: 'object'},
	      {
	        type: 'array',
	        items: {type: 'object'}
	      },
	    ],
	  },
	})	
	@Patch('property/:property')
	async update(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('offer', ParseBigIntPipe) offer: bigint, @Param('property', ParseIntPipe) property: number, @Body() updateDto: Object | Array<Object>) {
		return super.update(apiKey, catalog, offer, property, updateDto);
	}	
	
	@Delete('property/:property')
	async delete(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('offer', ParseBigIntPipe) offer: bigint, @Param('property', ParseIntPipe) property: number) {
		return super.delete(apiKey, catalog, offer, property);
	}		
	
	
}