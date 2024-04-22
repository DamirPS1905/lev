/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/controllers/product-property-values.controller
 * in a proper way.
 */
import { AuthInfo } from './../../../decorators/auth.decorator';
import { Actors } from './../../../entities/Actors';
import { CreateProductPropertyValueDto } from './../../dtos/create-product-property-value.dto';
import { UpdateProductPropertyValueDto } from './../../dtos/update-product-property-value.dto';
import { CatalogProductsService } from './../../services/catalog-products.service';
import { CatalogPropertiesService } from './../../services/catalog-properties.service';
import { CatalogsService } from './../../services/catalogs.service';
import { InstanceVersionsService } from './../../services/instance-versions.service';
import { ProductPropertyValuesService } from './../../services/product-property-values.service';
import { PropertyTypesService } from './../../services/property-types.service';
import { FsPatch } from './../../services/special/files.service';
import { EntityManager } from '@mikro-orm/postgresql';
import { Controller, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiHeader, ApiTags } from '@nestjs/swagger';

@ApiHeader({ name: 'X-API-KEY', required: true, description: 'Ваш идентефикатор апи' })
@UseGuards(AuthGuard('api-key'))
@ApiTags('Product property values')
@Controller('catalog/:catalog/product/:product')
export class GenProductPropertyValuesController {
	constructor(
		protected readonly catalogProductsService: CatalogProductsService,
		protected readonly catalogPropertiesService: CatalogPropertiesService,
		protected readonly catalogsService: CatalogsService,
		protected readonly instanceVersionsService: InstanceVersionsService,
		protected readonly productPropertyValuesService: ProductPropertyValuesService,
		protected readonly propertyTypesService: PropertyTypesService,
	) { }
	
	async findAll(actor: Actors, catalog: number, offset: number, limit: number) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===actor.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		if(offset<0) throw new HttpException('Wrong offset value', HttpStatus.BAD_REQUEST);
		if(limit<0) throw new HttpException('Wrong limit value', HttpStatus.BAD_REQUEST);
		if(limit>1000) limit = 1000;
		return await this.productPropertyValuesService.listAll(offset, limit);
	}
	
	async findOne(actor: Actors, catalog: number, product: bigint, property: number, order: number) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===actor.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		const entity = await this.productPropertyValuesService.findByProductAndPropertyAndOrder(product, property, order);
		if(entity===null){
			throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
		}
		await this.validateRead(entity, actor, catalog, product, property, order);
		return entity;
	}
	
	async validateRead(entity, actor: Actors, catalog: number, product: bigint, property: number, order: number) { }
	
	async update(actor: Actors, catalog: number, product: bigint, property: number, order: number, updateDto: UpdateProductPropertyValueDto) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===actor.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		return await this.productPropertyValuesService.transactional(async (em, fm) => {
			const entity = await this.productPropertyValuesService.findByProductAndPropertyAndOrder(product, property, order, em);
			const productIns = await this.catalogProductsService.findById(product);
			if(productIns===null || !(productIns.catalog.id===catalog)){
				throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
			}
			const propertyIns = await this.catalogPropertiesService.findById(property);
			if(propertyIns===null || !(propertyIns.catalog.id===catalog)){
				throw new HttpException('Property not found', HttpStatus.NOT_FOUND);
			}
			await this.validateUpdate(entity, actor, catalog, product, property, order, updateDto, em, fm);
			if(entity!==null){
				const result = await this.productPropertyValuesService.update(entity, updateDto, em);
				await this.afterUpdate(entity, actor, catalog, product, property, order, updateDto, em, fm);
				return result;
			} else {
				const result = await this.productPropertyValuesService.create(updateDto, em);
				await this.afterUpdate(entity, actor, catalog, product, property, order, updateDto, em, fm);
				return result;
			}
		});
	}
	
	async validateUpdate(entity, actor: Actors, catalog: number, product: bigint, property: number, order: number, updateDto: UpdateProductPropertyValueDto, em: EntityManager, fm: FsPatch) { }
	async afterUpdate(entity, actor: Actors, catalog: number, product: bigint, property: number, order: number, updateDto: UpdateProductPropertyValueDto, em: EntityManager, fm: FsPatch) { }
	
	async delete(actor: Actors, catalog: number, product: bigint, property: number, order: number) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===actor.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		return await this.productPropertyValuesService.transactional(async (em, fm) => {
			const entity = await this.productPropertyValuesService.findByProductAndPropertyAndOrder(product, property, order, em);
			if(entity===null){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			await this.validateDelete(entity, actor, catalog, product, property, order, em, fm);
			await this.productPropertyValuesService.remove(entity, em);
			await this.afterDelete(entity, actor, catalog, product, property, order, em, fm);
		});
	}
	
	async validateDelete(entity, actor: Actors, catalog: number, product: bigint, property: number, order: number, em: EntityManager, fm: FsPatch) { }
	async afterDelete(entity, actor: Actors, catalog: number, product: bigint, property: number, order: number, em: EntityManager, fm: FsPatch) { }
	
}