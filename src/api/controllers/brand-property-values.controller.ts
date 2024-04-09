import { AuthInfo } from './../../decorators/auth.decorator'
import { ApiKeys } from './../../entities/ApiKeys'
import { BrandPropertyValuesService } from './../services/brand-property-values.service'
import { MetatypeValuesController } from './abstract/metatype-property-values.controller'
import { EntityManager } from '@mikro-orm/postgresql'
import { Body, Controller, DefaultValuePipe, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiQuery, ApiTags, ApiExtraModels, ApiBody } from '@nestjs/swagger'
import { BrandPropertyValues } from './../../entities/BrandPropertyValues'
import { CatalogMetatypePropertiesService } from './../services/catalog-metatype-properties.service'
import { CatalogsService } from './../services/catalogs.service'
import { OptionsPropertyValuesService } from './../services/options-property-values.service'
import { PropertyTypesService } from './../services/property-types.service'
import { CatalogBrandsService } from './../services/catalog-brands.service'

@ApiTags('Brand property values')
@Controller('catalog/:catalog/brand/:brand')
export class BrandPropertyValuesController extends MetatypeValuesController<BrandPropertyValues, BrandPropertyValuesService> {
		
	protected readonly metatype:number = 2;
	protected readonly entityName:string = "BrandPropertyValues";

	constructor(
		catalogMetatypePropertiesService: CatalogMetatypePropertiesService,
		catalogsService: CatalogsService,
		optionsPropertyValuesService: OptionsPropertyValuesService,
		propertyTypesService: PropertyTypesService,
		valuesService: BrandPropertyValuesService,
		protected readonly catalogBrandsService: CatalogBrandsService
	){
		super(
			catalogMetatypePropertiesService,
			catalogsService,
			optionsPropertyValuesService,
			propertyTypesService,
			valuesService
		)
	}

	protected async validateInstance(catalog:number, instance:number, emt:EntityManager = null){
		const brandIns = await this.catalogBrandsService.findById(instance, emt);
		if(brandIns===null || brandIns.catalog.id!==catalog){
			throw new HttpException('Branf not found', HttpStatus.NOT_FOUND);			
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