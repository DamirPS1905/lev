import { AuthInfo } from './../../decorators/auth.decorator';
import { Actors } from './../../entities/Actors';
import { CreateCollectionPropertyValueDto } from './../dtos/create-collection-property-value.dto';
import { UpdateCollectionPropertyValueDto } from './../dtos/update-collection-property-value.dto';
import { CollectionPropertyValuesService } from './../services/collection-property-values.service';
import { MetatypeValuesController } from './abstract/metatype-property-values.controller'
import { EntityManager, wrap } from '@mikro-orm/postgresql';
import { Body, Controller, DefaultValuePipe, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiQuery, ApiOperation, ApiParam, ApiTags, ApiExtraModels, ApiBody } from '@nestjs/swagger'
import { CatalogMetatypePropertiesService } from './../services/catalog-metatype-properties.service'
import { CatalogsService } from './../services/catalogs.service'
import { OptionsPropertyValuesService } from './../services/options-property-values.service'
import { PropertyTypesService } from './../services/property-types.service'
import { CatalogBrandCollectionsService } from './../services/catalog-brand-collections.service'
import { MetatypesEnum } from './../enums/metatypes.enum'

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
			MetatypesEnum.BrandCollection,
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
	@ApiOperation({summary: "Получение значений всех свойств коллекции бренда"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'collection', description: 'ID коллекции бренда'})
	async findAll(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('collection', ParseIntPipe) collection: number) {
		return await super.findAll(actor, catalog, collection);
	}
	
	@Get('property/:property')
	@ApiOperation({summary: "Получение значения свойства коллекции бренда"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'collection', description: 'ID коллекции бренда'})
	@ApiParam({name: 'property', description: 'ID свойства'})
	async findOne(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('collection', ParseIntPipe) collection: number, @Param('property', ParseIntPipe) property: number) {
		return await super.findOne(actor, catalog, collection, property);
	}
	
	@Patch('property/:property')
	@ApiOperation({summary: "Задание или обновление значения свойства коллекции бренда"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'collection', description: 'ID коллекции бренда'})
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
	async update(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('collection', ParseIntPipe) collection: number, @Param('property', ParseIntPipe) property: number, @Body() updateDto: Object | Array<Object>) {
		return super.update(actor, catalog, collection, property, updateDto);
	}	
	
	@Delete('property/:property')
	@ApiOperation({summary: "Удаление значения свойства коллекции бренда"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'collection', description: 'ID коллекции бренда'})
	@ApiParam({name: 'property', description: 'ID свойства'})
	async delete(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('collection', ParseIntPipe) collection: number, @Param('property', ParseIntPipe) property: number) {
		return super.delete(actor, catalog, collection, property);
	}
	
}