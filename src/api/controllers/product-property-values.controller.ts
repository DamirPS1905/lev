import { AuthInfo } from './../../decorators/auth.decorator'
import { Actors } from './../../entities/Actors'
import { CreateProductPropertyValueDto } from './../dtos/create-product-property-value.dto'
import { UpdateProductPropertyValueDto } from './../dtos/update-product-property-value.dto'
import { ProductPropertyValuesService } from './../services/product-property-values.service'
import { EntityManager, wrap } from '@mikro-orm/postgresql'
import { Body, Controller, DefaultValuePipe, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Query } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiQuery, ApiOperation, ApiParam, ApiTags, ApiExtraModels, ApiBody } from '@nestjs/swagger'
import { PropertyInTypesService } from './../services/property-in-types.service'
import { CatalogsService } from './../services/catalogs.service'
import { OptionsPropertyValuesService } from './../services/options-property-values.service'
import { PropertyTypesService } from './../services/property-types.service'
import { CatalogProductsService } from './../services/catalog-products.service'
import { IMetatypeVauesService } from './../services/interface/i-metatype-values.service'
import { AbstractValuesController } from './abstract/abstract-values.controller'
import { ParseBigIntPipe } from './../../pipes/parse-bigint.pipe'

@ApiTags('Product property values')
@Controller('catalog/:catalog/product/:product')
export class ProductPropertyValuesController extends AbstractValuesController<bigint, ProductPropertyValuesService> {
	
	constructor(
		protected readonly propertyInTypesService: PropertyInTypesService,
		catalogsService: CatalogsService,
		optionsPropertyValuesService: OptionsPropertyValuesService,
		propertyTypesService: PropertyTypesService,
		valuesService: ProductPropertyValuesService,
		protected readonly catalogProductsService: CatalogProductsService
	){
		super(
			catalogsService,
			optionsPropertyValuesService,
			propertyTypesService,
			valuesService
		)
	}

	protected async validateInstance(catalog:number, instance:bigint, em:EntityManager = null){
		const productIns = await this.catalogProductsService.findById(instance, em);
		if(productIns===null || productIns.catalog.id!==catalog){
			throw new HttpException('Product not found', HttpStatus.NOT_FOUND);			
		}
	}
	
	protected async validateAttachment(catalog: number, property: number, instance: bigint, em: EntityManager = null){
		const productIns = await this.catalogProductsService.findById(instance, em),
					propertyInType = await this.propertyInTypesService.getParentsPropertyByChild(property, productIns.type.id, em);
		if(propertyInType===null){
			throw new HttpException('Property not found', HttpStatus.NOT_FOUND);			
		}
		await wrap(propertyInType.property).init();
		return [propertyInType.property, propertyInType.scheme];
	}
	
	@Get('property/all')
	@ApiOperation({summary: "Получение значений всех свойств товара"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'product', description: 'ID товара'})
	async findAll(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('product', ParseIntPipe) product: bigint) {
		return await super.findAll(actor, catalog, product);
	}
	
	@Get('property/:property')
	@ApiOperation({summary: "Получение значения свойства товара"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'product', description: 'ID товара'})
	@ApiParam({name: 'property', description: 'ID свойства'})
	async findOne(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('product', ParseBigIntPipe) product: bigint, @Param('property', ParseIntPipe) property: number) {
		return await super.findOne(actor, catalog, product, property);
	}
	
	@Patch('property/:property')
	@ApiOperation({summary: "Задание или обновление значения свойства товара"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'product', description: 'ID товара'})
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
	async update(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('product', ParseBigIntPipe) product: bigint, @Param('property', ParseIntPipe) property: number, @Body() updateDto: Object | Array<Object>) {
		return super.update(actor, catalog, product, property, updateDto);
	}	
	
	@Delete('property/:property')
	@ApiOperation({summary: "Удаление значения свойства товара"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'product', description: 'ID товара'})
	@ApiParam({name: 'property', description: 'ID свойства'})
	async delete(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('product', ParseBigIntPipe) product: bigint, @Param('property', ParseIntPipe) property: number) {
		return super.delete(actor, catalog, product, property);
	}		
	
}