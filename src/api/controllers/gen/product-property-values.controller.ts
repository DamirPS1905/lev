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
import { Controller, HttpException, HttpStatus, UseGuards } from '@nestjs/common'
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
	
	async findAll(apiKey: ApiKeys, catalog: number, offset: number, limit: number) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		if(offset<0) throw new HttpException('Wrong offset value', HttpStatus.BAD_REQUEST);
		if(limit<0) throw new HttpException('Wrong limit value', HttpStatus.BAD_REQUEST);
		if(limit>1000) limit = 1000;
		return await this.productPropertyValuesService.listAll(offset, limit);
	}
	
	async findOne(apiKey: ApiKeys, catalog: number, product: bigint, property: number) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		const entity = await this.productPropertyValuesService.findByProductAndProperty(product, property);
		if(entity===null){
			throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
		}
		await this.validateRead(entity, apiKey, catalog, product, property);
		return entity;
	}
	
	async validateRead(entity, apiKey: ApiKeys, catalog: number, product: bigint, property: number) { }
	
	async update(apiKey: ApiKeys, catalog: number, product: bigint, property: number, updateDto: UpdateProductPropertyValueDto) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		return await this.productPropertyValuesService.transactional(async (em) => {
			const entity = await this.productPropertyValuesService.findByProductAndProperty(product, property, em);
			const propertyIns = await this.catalogPropertiesService.findById(property);
			if(propertyIns===null || !(propertyIns.catalog.id===catalog)){
				throw new HttpException('Property not found', HttpStatus.NOT_FOUND);
			}
			const productIns = await this.catalogProductsService.findById(product);
			if(productIns===null || !(productIns.catalog.id===catalog)){
				throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
			}
			await this.validateUpdate(entity, apiKey, catalog, product, property, updateDto, em);
			if(entity!==null){
				return await this.productPropertyValuesService.update(entity, updateDto, em);
			} else {
				return await this.productPropertyValuesService.create(updateDto, em);
			}
		});
	}
	
	async validateUpdate(entity, apiKey: ApiKeys, catalog: number, product: bigint, property: number, updateDto: UpdateProductPropertyValueDto, em: EntityManager) { }
	
	async delete(apiKey: ApiKeys, catalog: number, product: bigint, property: number) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		return await this.productPropertyValuesService.transactional(async (em) => {
			const entity = await this.productPropertyValuesService.findByProductAndProperty(product, property, em);
			if(entity===null){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			await this.validateDelete(entity, apiKey, catalog, product, property, em);
			return await this.productPropertyValuesService.remove(entity, em);
		});
	}
	
	async validateDelete(entity, apiKey: ApiKeys, catalog: number, product: bigint, property: number, em: EntityManager) { }
	
}