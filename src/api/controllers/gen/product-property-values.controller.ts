/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/controllers/product-property-values.controller
 * in a proper way.
 */
import { AuthInfo } from './../../../decorators/auth.decorator'
import { ApiKeys } from './../../../entities/ApiKeys'
import { CreateProductPropertyValueDto } from './../../dtos/create-product-property-value.dto'
import { UpdateProductPropertyValueDto } from './../../dtos/update-product-property-value.dto'
import { CatalogProductsService } from './../../services/catalog-products.service'
import { CatalogPropertiesService } from './../../services/catalog-properties.service'
import { CatalogsService } from './../../services/catalogs.service'
import { ProductPropertyValuesService } from './../../services/product-property-values.service'
import { EntityManager } from '@mikro-orm/postgresql'
import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiHeader, ApiTags } from '@nestjs/swagger'

@ApiHeader({ name: 'X-API-KEY', required: true })
@UseGuards(AuthGuard('api-key'))
@ApiTags('Product property values')
@Controller('catalog/:catalog/product/:product')
export class GenProductPropertyValuesController {
	constructor(
		protected readonly catalogProductsService: CatalogProductsService,
		protected readonly catalogPropertiesService: CatalogPropertiesService,
		protected readonly catalogsService: CatalogsService,
		protected readonly productPropertyValuesService: ProductPropertyValuesService,
	) { }
	
	@Get('property/:property')
	async findOne(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('product') product: bigint, @Param('property', ParseIntPipe) property: number) {
		const catalogIns0 = await this.catalogsService.findById(catalog);
		if(catalogIns0===null || !(catalogIns0.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		const entity = await this.productPropertyValuesService.findByProductAndProperty(product, property);
		if(entity===null){
			throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
		}
		this.validateRead(entity, apiKey, catalog, product, property);
		return entity;
	}
	
	validateRead(entity, apiKey: ApiKeys, catalog: number, product: bigint, property: number) { }
	
	@Patch('property/:property')
	async update(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('product') product: bigint, @Param('property', ParseIntPipe) property: number, @Body() updateDto: UpdateProductPropertyValueDto) {
		updateDto.product = product;
		updateDto.property = property;
		const catalogIns0 = await this.catalogsService.findById(catalog);
		if(catalogIns0===null || !(catalogIns0.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		return await this.productPropertyValuesService.transactional(async (em) => {
			const entity = await this.productPropertyValuesService.findByProductAndProperty(product, property, em);
			if((updateDto.property!==undefined && updateDto.property!==entity.property.id)){
				const propertyIns1 = await this.catalogPropertiesService.findById(updateDto.property);
				if(propertyIns1===null || !(propertyIns1.catalog.id===catalog)){
					throw new HttpException('Property not found', HttpStatus.NOT_FOUND);
				}
			}
			if((updateDto.product!==undefined && updateDto.product!==entity.product.id)){
				const productIns2 = await this.catalogProductsService.findById(updateDto.product);
				if(productIns2===null || !(productIns2.catalog.id===catalog)){
					throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
				}
			}
			this.validateUpdate(entity, apiKey, catalog, product, property, updateDto, em);
			if(entity===null){
				return await this.productPropertyValuesService.update(entity, updateDto, em);
			} else {
				return await this.productPropertyValuesService.create(updateDto, em);
			}
		});
	}
	
	validateUpdate(entity, apiKey: ApiKeys, catalog: number, product: bigint, property: number, updateDto: UpdateProductPropertyValueDto, em: EntityManager) { }
	
	@Delete('property/:property')
	async delete(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('product') product: bigint, @Param('property', ParseIntPipe) property: number) {
		const catalogIns0 = await this.catalogsService.findById(catalog);
		if(catalogIns0===null || !(catalogIns0.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		return await this.productPropertyValuesService.transactional(async (em) => {
			const entity = await this.productPropertyValuesService.findByProductAndProperty(product, property, em);
			if(entity===null){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			this.validateDelete(entity, apiKey, catalog, product, property, em);
			return await this.productPropertyValuesService.remove(entity, em);
		});
	}
	
	validateDelete(entity, apiKey: ApiKeys, catalog: number, product: bigint, property: number, em: EntityManager) { }
	
}