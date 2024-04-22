import { AuthInfo } from './../../decorators/auth.decorator'
import { Actors } from './../../entities/Actors'
import { PropertyValues } from './../../entities/PropertyValues'
import { TypePropertyValues } from './../../entities/TypePropertyValues'
import { TypePropertyValuesService } from './../services/type-property-values.service'
import { MetatypeValuesController } from './abstract/metatype-property-values.controller'
import { EntityManager } from '@mikro-orm/postgresql'
import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBody, ApiOperation, ApiParam, ApiExtraModels, ApiTags } from '@nestjs/swagger'
import { CatalogMetatypePropertiesService } from './../services/catalog-metatype-properties.service'
import { CatalogsService } from './../services/catalogs.service'
import { OptionsPropertyValuesService } from './../services/options-property-values.service'
import { PropertyTypesService } from './../services/property-types.service'
import { CatalogTypesService } from './../services/catalog-types.service'
import { MetatypesEnum } from './../enums/metatypes.enum'

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
			MetatypesEnum.CatalogType,
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
	@ApiOperation({summary: "Получение значений всех свойств типа товара"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'type', description: 'ID типа товара'})
	async findAll(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('type', ParseIntPipe) type: number) {
		type = await this.processInputType(catalog, type);
		return await super.findAll(actor, catalog, type);
	}
	
	@Get('property/:property')
	@ApiOperation({summary: "Получение значения свойства типа товара"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'type', description: 'ID типа товара'})
	@ApiParam({name: 'property', description: 'ID свойства'})
	async findOne(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('type', ParseIntPipe) type: number, @Param('property', ParseIntPipe) property: number) {
		type = await this.processInputType(catalog, type);
		return await super.findOne(actor, catalog, type, property);
	}
	
	@Patch('property/:property')
	@ApiOperation({summary: "Задание или обновление значения свойства типа товара"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'type', description: 'ID типа товара'})
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
	async update(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('type', ParseIntPipe) type: number, @Param('property', ParseIntPipe) property: number, @Body() updateDto: Object | Array<Object>) {
		type = await this.processInputType(catalog, type);
		return super.update(actor, catalog, type, property, updateDto);
	}	
	
	@Delete('property/:property')
	@ApiOperation({summary: "Удаление значения свойства типа товара"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'type', description: 'ID типа товара'})
	@ApiParam({name: 'property', description: 'ID свойства'})
	async delete(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('type', ParseIntPipe) type: number, @Param('property', ParseIntPipe) property: number) {
		type = await this.processInputType(catalog, type);
		return super.delete(actor, catalog, type, property);
	}
	
	async processInputType(catalog: number, type: number, em: EntityManager = null){
		if(type===0){
			return (await this.catalogTypesService.findRoot(catalog, em)).id;
		}else{
			return type;
		}
	}
	
}