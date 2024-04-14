import { AuthInfo } from './../../decorators/auth.decorator'
import { ApiKeys } from './../../entities/ApiKeys'
import { PropertyValues } from './../../entities/PropertyValues'
import { TypePropertyValues } from './../../entities/TypePropertyValues'
import { TypePropertyValuesService } from './../services/type-property-values.service'
import { MetatypeValuesController } from './abstract/metatype-property-values.controller'
import { EntityManager } from '@mikro-orm/postgresql'
import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBody, ApiExtraModels, ApiTags } from '@nestjs/swagger'
import { CatalogMetatypePropertiesService } from './../services/catalog-metatype-properties.service'
import { CatalogsService } from './../services/catalogs.service'
import { OptionsPropertyValuesService } from './../services/options-property-values.service'
import { PropertyTypesService } from './../services/property-types.service'
import { CatalogTypesService } from './../services/catalog-types.service'

@ApiTags('Type property values')
@Controller('catalog/:catalog/type/:type')
export class TypePropertyValuesController extends MetatypeValuesController<TypePropertyValuesService> {
		
	constructor(
		catalogMetatypePropertiesService: CatalogMetatypePropertiesService,
		catalogsService: CatalogsService,
		optionsPropertyValuesService: OptionsPropertyValuesService,
		propertyTypesService: PropertyTypesService,
		valuesService: TypePropertyValuesService,
		protected readonly catalogTypesService: CatalogTypesService
	){
		super(
			1,
			"TypePropertyValues",
			catalogMetatypePropertiesService,
			catalogsService,
			optionsPropertyValuesService,
			propertyTypesService,
			valuesService
		)
	}

	protected async validateInstance(catalog:number, instance:number, emt:EntityManager = null){
		const typeIns = await this.catalogTypesService.findById(instance, emt);
		if(typeIns===null || typeIns.catalog.id!==catalog){
			throw new HttpException('Type not found', HttpStatus.NOT_FOUND);			
		}
	}
	
	@Get('property/all')
	async findAll(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('type', ParseIntPipe) type: number) {
		return await super.findAll(apiKey, catalog, type);
	}
	
	@Get('property/:property')
	async findOne(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('type', ParseIntPipe) type: number, @Param('property', ParseIntPipe) property: number) {
		return await super.findOne(apiKey, catalog, type, property);
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
	async update(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('type', ParseIntPipe) type: number, @Param('property', ParseIntPipe) property: number, @Body() updateDto: Object | Array<Object>) {
		return super.update(apiKey, catalog, type, property, updateDto);
	}	
	
	@Delete('property/:property')
	async delete(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('type', ParseIntPipe) type: number, @Param('property', ParseIntPipe) property: number) {
		return super.delete(apiKey, catalog, type, property);
	}	
	
}