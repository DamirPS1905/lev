/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/controllers/catalog-products.controller
 * in a proper way.
 */
import { AuthInfo } from './../../../decorators/auth.decorator'
import { ApiKeys } from './../../../entities/ApiKeys'
import { CreateCatalogProductDto } from './../../dtos/create-catalog-product.dto'
import { UpdateCatalogProductDto } from './../../dtos/update-catalog-product.dto'
import { CatalogBrandsService } from './../../services/catalog-brands.service'
import { CatalogProductsService } from './../../services/catalog-products.service'
import { CatalogTypesService } from './../../services/catalog-types.service'
import { CatalogsService } from './../../services/catalogs.service'
import { EntityManager } from '@mikro-orm/postgresql'
import { Controller, HttpException, HttpStatus, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiHeader, ApiTags } from '@nestjs/swagger'

@ApiHeader({ name: 'X-API-KEY', required: true })
@UseGuards(AuthGuard('api-key'))
@ApiTags('Catalog products')
@Controller('catalog/:catalog/products')
export class GenCatalogProductsController {
	constructor(
		protected readonly catalogBrandsService: CatalogBrandsService,
		protected readonly catalogProductsService: CatalogProductsService,
		protected readonly catalogTypesService: CatalogTypesService,
		protected readonly catalogsService: CatalogsService,
	) { }
	
	async findAll(apiKey: ApiKeys, catalog: number, offset: number, limit: number, catalog: number) {
		const catalogIns0 = await this.catalogsService.findById(catalog);
		if(catalogIns0===null || !(catalogIns0.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		if(offset<0) throw new HttpException('Wrong offset value', HttpStatus.BAD_REQUEST);
		if(limit<0) throw new HttpException('Wrong limit value', HttpStatus.BAD_REQUEST);
		if(limit>1000) limit = 1000;
		return await this.catalogProductsService.listByCatalog(catalog, offset, limit);
	}
	
	async findOne(apiKey: ApiKeys, catalog: number, id: bigint) {
		const catalogIns0 = await this.catalogsService.findById(catalog);
		if(catalogIns0===null || !(catalogIns0.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		const entity = await this.catalogProductsService.findById(id);
		if(entity===null || !(entity.catalog.id===catalog)){
			throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
		}
		await this.validateRead(entity, apiKey, catalog, id);
		return entity;
	}
	
	async validateRead(entity, apiKey: ApiKeys, catalog: number, id: bigint) { }
	
	async create(apiKey: ApiKeys, catalog: number, createDto: CreateCatalogProductDto) {
		createDto.catalog = catalog;
		const catalogIns0 = await this.catalogsService.findById(catalog);
		if(catalogIns0===null || !(catalogIns0.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		return await this.catalogProductsService.transactional(async (em) => {
			const existed0 = await this.catalogProductsService.findByCatalogAndTitle(createDto.catalog, createDto.title, em);
			if(existed0!==null){
				throw new HttpException('Duplicate (catalog, title)', HttpStatus.CONFLICT);
			}
			const brandIns1 = await this.catalogBrandsService.findById(createDto.brand);
			if(brandIns1===null || !(brandIns1.catalog.id===catalog)){
				throw new HttpException('Brand not found', HttpStatus.CONFLICT);
			}
			const typeIns2 = await this.catalogTypesService.findById(createDto.type);
			if(typeIns2===null || !(typeIns2.catalog.id===catalog)){
				throw new HttpException('Type not found', HttpStatus.CONFLICT);
			}
			await this.validateCreate(apiKey, catalog, createDto, em);
			return await this.catalogProductsService.create(createDto, em);
		});
	}
	
	async validateCreate(apiKey: ApiKeys, catalog: number, createDto: CreateCatalogProductDto, em: EntityManager) { }
	
	async update(apiKey: ApiKeys, catalog: number, id: bigint, updateDto: UpdateCatalogProductDto) {
		updateDto.catalog = catalog;
		const catalogIns0 = await this.catalogsService.findById(catalog);
		if(catalogIns0===null || !(catalogIns0.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		return await this.catalogProductsService.transactional(async (em) => {
			const entity = await this.catalogProductsService.findById(id, em);
			const brandIns1 = await this.catalogBrandsService.findById(updateDto.brand);
			if(brandIns1===null || !(brandIns1.catalog.id===catalog)){
				throw new HttpException('Brand not found', HttpStatus.CONFLICT);
			}
			const typeIns2 = await this.catalogTypesService.findById(updateDto.type);
			if(typeIns2===null || !(typeIns2.catalog.id===catalog)){
				throw new HttpException('Type not found', HttpStatus.CONFLICT);
			}
			if(entity===null || !(entity.catalog.id===catalog)){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			if((updateDto.catalog!==undefined && updateDto.catalog!==entity.catalog.id) || (updateDto.title!==undefined && updateDto.title!==entity.title)){
				const existed0 = await this.catalogProductsService.findByCatalogAndTitle(updateDto.catalog, updateDto.title, em);
				if(existed0!==null && (entity.id !== existed0.id)){
					throw new HttpException('Duplicate (catalog, title)', HttpStatus.CONFLICT);
				}
			}
			this.validateUpdate(entity, apiKey, catalog, id, updateDto);
			return await this.catalogProductsService.update(entity, updateDto, em);
		});
	}
	
	async validateUpdate(entity, apiKey: ApiKeys, catalog: number, id: bigint, updateDto: UpdateCatalogProductDto) { }
	
	async delete(apiKey: ApiKeys, catalog: number, id: bigint) {
		const catalogIns0 = await this.catalogsService.findById(catalog);
		if(catalogIns0===null || !(catalogIns0.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		return await this.catalogProductsService.transactional(async (em) => {
			const entity = await this.catalogProductsService.findById(id, em);
			if(entity===null || !(entity.catalog.id===catalog)){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			await this.validateDelete(entity, apiKey, catalog, id, em);
			return await this.catalogProductsService.remove(entity, em);
		});
	}
	
	async validateDelete(entity, apiKey: ApiKeys, catalog: number, id: bigint, em: EntityManager) { }
	
}