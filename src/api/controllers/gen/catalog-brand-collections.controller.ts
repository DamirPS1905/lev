/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/controllers/catalog-brand-collections.controller
 * in a proper way.
 */
import { AuthInfo } from './../../../decorators/auth.decorator';
import { ApiKeys } from './../../../entities/ApiKeys';
import { CreateCatalogBrandCollectionDto } from './../../dtos/create-catalog-brand-collection.dto';
import { UpdateCatalogBrandCollectionDto } from './../../dtos/update-catalog-brand-collection.dto';
import { CatalogBrandCollectionsService } from './../../services/catalog-brand-collections.service';
import { CatalogBrandsService } from './../../services/catalog-brands.service';
import { CatalogsService } from './../../services/catalogs.service';
import { EntityManager } from '@mikro-orm/postgresql';
import { Controller, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiHeader, ApiTags } from '@nestjs/swagger';

@ApiHeader({ name: 'X-API-KEY', required: true, description: 'Ваш идентефикатор апи' })
@UseGuards(AuthGuard('api-key'))
@ApiTags('Catalog brand collections')
@Controller('catalog/:catalog/brand/:brand/collection')
export class GenCatalogBrandCollectionsController {
	constructor(
		protected readonly catalogBrandCollectionsService: CatalogBrandCollectionsService,
		protected readonly catalogBrandsService: CatalogBrandsService,
		protected readonly catalogsService: CatalogsService,
	) { }
	
	async findAll(apiKey: ApiKeys, catalog: number, brand: number) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		const brandIns = await this.catalogBrandsService.findById(brand);
		if(brandIns===null || !(brandIns.catalog.id===catalog)){
			throw new HttpException('Brand not found', HttpStatus.NOT_FOUND);
		}
		return await this.catalogBrandCollectionsService.findAll();
	}
	
	async findOne(apiKey: ApiKeys, catalog: number, brand: number, id: number) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		const brandIns = await this.catalogBrandsService.findById(brand);
		if(brandIns===null || !(brandIns.catalog.id===catalog)){
			throw new HttpException('Brand not found', HttpStatus.NOT_FOUND);
		}
		const entity = await this.catalogBrandCollectionsService.findById(id);
		if(entity===null || !(entity.brand.id===brand)){
			throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
		}
		await this.validateRead(entity, apiKey, catalog, brand, id);
		return entity;
	}
	
	async validateRead(entity, apiKey: ApiKeys, catalog: number, brand: number, id: number) { }
	
	async create(apiKey: ApiKeys, catalog: number, brand: number, createDto: CreateCatalogBrandCollectionDto) {
		createDto.brand = brand;
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		const brandIns = await this.catalogBrandsService.findById(brand);
		if(brandIns===null || !(brandIns.catalog.id===catalog)){
			throw new HttpException('Brand not found', HttpStatus.NOT_FOUND);
		}
		return await this.catalogBrandCollectionsService.transactional(async (em) => {
			const existed0 = await this.catalogBrandCollectionsService.findByBrandAndTitle(brand, createDto.title, em);
			if(existed0!==null){
				throw new HttpException('Duplicate (brand, title)', HttpStatus.CONFLICT);
			}
			const tmp = await this.catalogBrandsService.findById(brand, em);
			if(tmp===null){
				throw new HttpException('Not found contrainst (brand)', HttpStatus.CONFLICT);
			}
			await this.validateCreate(apiKey, catalog, brand, createDto, em);
			return await this.catalogBrandCollectionsService.create(createDto, em);
		});
	}
	
	async validateCreate(apiKey: ApiKeys, catalog: number, brand: number, createDto: CreateCatalogBrandCollectionDto, em: EntityManager) { }
	
	async update(apiKey: ApiKeys, catalog: number, brand: number, id: number, updateDto: UpdateCatalogBrandCollectionDto) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		const brandIns = await this.catalogBrandsService.findById(brand);
		if(brandIns===null || !(brandIns.catalog.id===catalog)){
			throw new HttpException('Brand not found', HttpStatus.NOT_FOUND);
		}
		return await this.catalogBrandCollectionsService.transactional(async (em) => {
			const entity = await this.catalogBrandCollectionsService.findById(id, em);
			const tmp = await this.catalogBrandsService.findById(brand, em);
			if(tmp===null){
				throw new HttpException('Not found contrainst (brand)', HttpStatus.CONFLICT);
			}
			if(entity===null || !(entity.brand.id===brand)){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			if((updateDto.brand!==undefined && updateDto.brand!==entity.brand.id) || (updateDto.title!==undefined && updateDto.title!==entity.title)){
				const existed = await this.catalogBrandCollectionsService.findByBrandAndTitle(updateDto.brand, updateDto.title, em);
				if(existed!==null && (entity.id!==existed.id)){
					throw new HttpException('Duplicate (brand, title)', HttpStatus.CONFLICT);
				}
			}
			await this.validateUpdate(entity, apiKey, catalog, brand, id, updateDto, em);
			return await this.catalogBrandCollectionsService.update(entity, updateDto, em);
		});
	}
	
	async validateUpdate(entity, apiKey: ApiKeys, catalog: number, brand: number, id: number, updateDto: UpdateCatalogBrandCollectionDto, em: EntityManager) { }
	
	async delete(apiKey: ApiKeys, catalog: number, brand: number, id: number) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		const brandIns = await this.catalogBrandsService.findById(brand);
		if(brandIns===null || !(brandIns.catalog.id===catalog)){
			throw new HttpException('Brand not found', HttpStatus.NOT_FOUND);
		}
		return await this.catalogBrandCollectionsService.transactional(async (em) => {
			const entity = await this.catalogBrandCollectionsService.findById(id, em);
			if(entity===null || !(entity.brand.id===brand)){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			await this.validateDelete(entity, apiKey, catalog, brand, id, em);
			return await this.catalogBrandCollectionsService.remove(entity, em);
		});
	}
	
	async validateDelete(entity, apiKey: ApiKeys, catalog: number, brand: number, id: number, em: EntityManager) { }
	
}