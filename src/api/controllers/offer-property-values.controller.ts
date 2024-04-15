import { AuthInfo } from './../../decorators/auth.decorator'
import { Actors } from './../../entities/Actors'
import { CreateOfferPropertyValueDto } from './../dtos/create-offer-property-value.dto'
import { UpdateOfferPropertyValueDto } from './../dtos/update-offer-property-value.dto'
import { OfferPropertyValuesService } from './../services/offer-property-values.service'
import { EntityManager, wrap } from '@mikro-orm/postgresql'
import { Body, Controller, DefaultValuePipe, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Query } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiQuery, ApiOperation, ApiParam, ApiTags, ApiExtraModels, ApiBody } from '@nestjs/swagger'
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
	@ApiOperation({summary: "Получение значений всех свойств товарного предложения"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'offer', description: 'ID коллекции бренда'})
	async findAll(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('offer', ParseBigIntPipe) offer: bigint) {
		return await super.findAll(actor, catalog, offer);
	}
	
	@Get('property/:property')
	@ApiOperation({summary: "Получение значения свойства коллекции бренда"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'offer', description: 'ID коллекции бренда'})
	@ApiParam({name: 'property', description: 'ID свойства'})
	async findOne(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('offer', ParseBigIntPipe) offer: bigint, @Param('property', ParseIntPipe) property: number) {
		return await super.findOne(actor, catalog, offer, property);
	}
	
	@Patch('property/:property')
	@ApiOperation({summary: "Задание или обновление значения свойства коллекции бренда"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'offer', description: 'ID коллекции бренда'})
	@ApiParam({name: 'property', description: 'ID свойства'})
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
	async update(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('offer', ParseBigIntPipe) offer: bigint, @Param('property', ParseIntPipe) property: number, @Body() updateDto: Object | Array<Object>) {
		return super.update(actor, catalog, offer, property, updateDto);
	}	
	
	@Delete('property/:property')
	@ApiOperation({summary: "Удаление значения свойства коллекции бренда"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'offer', description: 'ID коллекции бренда'})
	@ApiParam({name: 'property', description: 'ID свойства'})
	async delete(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('offer', ParseBigIntPipe) offer: bigint, @Param('property', ParseIntPipe) property: number) {
		return super.delete(actor, catalog, offer, property);
	}		
	
	
}