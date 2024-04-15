import { AuthInfo } from './../../decorators/auth.decorator'
import { ApiKeys } from './../../entities/ApiKeys'
import { BrandPropertyValuesService } from './../services/brand-property-values.service'
import { MetatypeValuesController } from './abstract/metatype-property-values.controller'
import { EntityManager } from '@mikro-orm/postgresql'
import { Body, Controller, DefaultValuePipe, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiQuery, ApiOperation, ApiParam, ApiTags, ApiExtraModels, ApiBody } from '@nestjs/swagger'
import { CatalogMetatypePropertiesService } from './../services/catalog-metatype-properties.service'
import { CatalogsService } from './../services/catalogs.service'
import { OptionsPropertyValuesService } from './../services/options-property-values.service'
import { PropertyTypesService } from './../services/property-types.service'
import { CatalogBrandsService } from './../services/catalog-brands.service'

@ApiTags('Brand property values')
@Controller('catalog/:catalog/brand/:brand')
export class BrandPropertyValuesController extends MetatypeValuesController<BrandPropertyValuesService> {
	
	constructor(
		catalogMetatypePropertiesService: CatalogMetatypePropertiesService,
		catalogsService: CatalogsService,
		optionsPropertyValuesService: OptionsPropertyValuesService,
		propertyTypesService: PropertyTypesService,
		valuesService: BrandPropertyValuesService,
		protected readonly catalogBrandsService: CatalogBrandsService
	){
		super(
			2,
			"BrandPropertyValues",
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
			throw new HttpException('Brand not found', HttpStatus.NOT_FOUND);			
		}
	}
			
	@Get('property/all')
	@ApiOperation({summary: "Получение значений всех свойств бренда"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'brand', description: 'ID бренда'})
	async findAll(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('brand', ParseIntPipe) brand: number) {
		return await super.findAll(apiKey, catalog, brand);
	}
	
	@Get('property/:property')
	@ApiOperation({summary: "Получение значения свойства бренда"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'brand', description: 'ID бренда'})
	@ApiParam({name: 'property', description: 'ID свойства'})
	async findOne(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('brand', ParseIntPipe) brand: number, @Param('property', ParseIntPipe) property: number) {
		return await super.findOne(apiKey, catalog, brand, property);
	}
	
	@Patch('property/:property')
	@ApiOperation({summary: "Задание или обновление значения свойства бренда"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'brand', description: 'ID бренда'})
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
	async update(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('brand', ParseIntPipe) brand: number, @Param('property', ParseIntPipe) property: number, @Body() updateDto: Object | Array<Object>) {
		return super.update(apiKey, catalog, brand, property, updateDto);
	}	
	
	@Delete('property/:property')
	@ApiOperation({summary: "Удаление значения свойства бренда"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'brand', description: 'ID бренда'})
	@ApiParam({name: 'property', description: 'ID свойства'})
	async delete(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('brand', ParseIntPipe) brand: number, @Param('property', ParseIntPipe) property: number) {
		return super.delete(apiKey, catalog, brand, property);
	}	
}