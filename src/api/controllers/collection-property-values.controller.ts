import { AuthInfo } from './../../decorators/auth.decorator';
import { ApiKeys } from './../../entities/ApiKeys';
import { CreateCollectionPropertyValueDto } from './../dtos/create-collection-property-value.dto';
import { UpdateCollectionPropertyValueDto } from './../dtos/update-collection-property-value.dto';
import { CollectionPropertyValuesService } from './../services/collection-property-values.service';
import { MetatypeValuesController } from './abstract/metatype-property-values.controller'
import { EntityManager, wrap } from '@mikro-orm/postgresql';
import { Body, Controller, DefaultValuePipe, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiQuery, ApiTags, ApiExtraModels, ApiBody } from '@nestjs/swagger'
import { CatalogMetatypePropertiesService } from './../services/catalog-metatype-properties.service'
import { CatalogsService } from './../services/catalogs.service'
import { OptionsPropertyValuesService } from './../services/options-property-values.service'
import { PropertyTypesService } from './../services/property-types.service'
import { CatalogBrandCollectionsService } from './../services/catalog-brand-collections.service'

@ApiTags('Brand collection property values')
@Controller('catalog/:catalog/collection/:collection')
export class CollectionPropertyValuesController extends MetatypeValuesController<CollectionPropertyValuesService> {
	
	constructor(
		catalogMetatypePropertiesService: CatalogMetatypePropertiesService,
		catalogsService: CatalogsService,
		optionsPropertyValuesService: OptionsPropertyValuesService,
		propertyTypesService: PropertyTypesService,
		valuesService: CollectionPropertyValuesService,
		protected readonly catalogBrandCollectionsService: CatalogBrandCollectionsService
	){
		super(
			3,
			"CollectionPropertyValues",
			catalogMetatypePropertiesService,
			catalogsService,
			optionsPropertyValuesService,
			propertyTypesService,
			valuesService
		)
	}

	protected async validateInstance(catalog:number, instance:number, emt:EntityManager = null){
		const collectionIns = await this.catalogBrandCollectionsService.findById(instance, emt);
		if(collectionIns===null){
			throw new HttpException('Collection not found', HttpStatus.NOT_FOUND);			
		}
		wrap(collectionIns.brand).init();
		if(collectionIns.brand.catalog.id!==catalog){
			throw new HttpException('Collection not found', HttpStatus.NOT_FOUND);			
		}
	}
			
	@Get('property/all')
	async findAll(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('brand', ParseIntPipe) brand: number) {
		return await super.findAll(apiKey, catalog, brand);
	}
	
	@Get('property/:property')
	async findOne(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('brand', ParseIntPipe) brand: number, @Param('property', ParseIntPipe) property: number) {
		return await super.findOne(apiKey, catalog, brand, property);
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
	async update(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('brand', ParseIntPipe) brand: number, @Param('property', ParseIntPipe) property: number, @Body() updateDto: Object | Array<Object>) {
		return super.update(apiKey, catalog, brand, property, updateDto);
	}	
	
	@Delete('property/:property')
	async delete(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('brand', ParseIntPipe) brand: number, @Param('property', ParseIntPipe) property: number) {
		return super.delete(apiKey, catalog, brand, property);
	}
	
}