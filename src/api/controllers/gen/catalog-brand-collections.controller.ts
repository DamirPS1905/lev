/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/controllers/catalog-brand-collections.controller
 * in a proper way.
 */
import { AuthInfo } from './../../../decorators/auth.decorator';
import { Actors } from './../../../entities/Actors';
import { CreateCatalogBrandCollectionDto } from './../../dtos/create-catalog-brand-collection.dto';
import { UpdateCatalogBrandCollectionDto } from './../../dtos/update-catalog-brand-collection.dto';
import { CatalogBrandCollectionsService } from './../../services/catalog-brand-collections.service';
import { CatalogBrandsService } from './../../services/catalog-brands.service';
import { CatalogsService } from './../../services/catalogs.service';
import { FileLoadTasksService } from './../../services/file-load-tasks.service';
import { InstanceVersionsService } from './../../services/instance-versions.service';
import { FsPatch } from './../../services/special/files.service';
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
		protected readonly fileLoadTasksService: FileLoadTasksService,
		protected readonly instanceVersionsService: InstanceVersionsService,
	) { }
	
	async findAll(actor: Actors, catalog: number, brand: number) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===actor.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		const brandIns = await this.catalogBrandsService.findById(brand);
		if(brandIns===null || !(brandIns.catalog.id===catalog)){
			throw new HttpException('Brand not found', HttpStatus.NOT_FOUND);
		}
		return await this.catalogBrandCollectionsService.findAll();
	}
	
	async findOne(actor: Actors, catalog: number, brand: number, id: number) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===actor.company.id)){
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
		await this.validateRead(entity, actor, catalog, brand, id);
		return entity;
	}
	
	async validateRead(entity, actor: Actors, catalog: number, brand: number, id: number) { }
	
	async create(actor: Actors, catalog: number, brand: number, createDto: CreateCatalogBrandCollectionDto) {
		createDto.brand = brand;
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===actor.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		const brandIns = await this.catalogBrandsService.findById(brand);
		if(brandIns===null || !(brandIns.catalog.id===catalog)){
			throw new HttpException('Brand not found', HttpStatus.NOT_FOUND);
		}
		return await this.catalogBrandCollectionsService.transactional(async (em, fm) => {
			const existed0 = await this.catalogBrandCollectionsService.findByBrandAndTitle(brand, createDto.title, em);
			if(existed0!==null){
				throw new HttpException('Duplicate (brand, title)', HttpStatus.CONFLICT);
			}
			const tmp = await this.catalogBrandsService.findById(brand, em);
			if(tmp===null){
				throw new HttpException('Not found contrainst (brand)', HttpStatus.CONFLICT);
			}
			await this.validateCreate(actor, catalog, brand, createDto, em, fm);
			const result = await this.catalogBrandCollectionsService.create(createDto, em);
			await this.afterCreate(result, actor, catalog, brand, createDto, em, fm);
			return result;
		});
	}
	
	async validateCreate(actor: Actors, catalog: number, brand: number, createDto: CreateCatalogBrandCollectionDto, em: EntityManager, fm: FsPatch) { }
	async afterCreate(entity, actor: Actors, catalog: number, brand: number, createDto: CreateCatalogBrandCollectionDto, em: EntityManager, fm: FsPatch) { }
	
	async update(actor: Actors, catalog: number, brand: number, id: number, updateDto: UpdateCatalogBrandCollectionDto) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===actor.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		const brandIns = await this.catalogBrandsService.findById(brand);
		if(brandIns===null || !(brandIns.catalog.id===catalog)){
			throw new HttpException('Brand not found', HttpStatus.NOT_FOUND);
		}
		return await this.catalogBrandCollectionsService.transactional(async (em, fm) => {
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
			await this.validateUpdate(entity, actor, catalog, brand, id, updateDto, em, fm);
			return await this.catalogBrandCollectionsService.update(entity, updateDto, em);
		});
	}
	
	async validateUpdate(entity, actor: Actors, catalog: number, brand: number, id: number, updateDto: UpdateCatalogBrandCollectionDto, em: EntityManager, fm: FsPatch) { }
	async afterUpdate(entity, actor: Actors, catalog: number, brand: number, id: number, updateDto: UpdateCatalogBrandCollectionDto, em: EntityManager, fm: FsPatch) { }
	
	async delete(actor: Actors, catalog: number, brand: number, id: number) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===actor.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		const brandIns = await this.catalogBrandsService.findById(brand);
		if(brandIns===null || !(brandIns.catalog.id===catalog)){
			throw new HttpException('Brand not found', HttpStatus.NOT_FOUND);
		}
		return await this.catalogBrandCollectionsService.transactional(async (em, fm) => {
			const entity = await this.catalogBrandCollectionsService.findById(id, em);
			if(entity===null || !(entity.brand.id===brand)){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			await this.validateDelete(entity, actor, catalog, brand, id, em, fm);
			await this.catalogBrandCollectionsService.remove(entity, em);
			await this.afterDelete(entity, actor, catalog, brand, id, em, fm);
		});
	}
	
	async validateDelete(entity, actor: Actors, catalog: number, brand: number, id: number, em: EntityManager, fm: FsPatch) { }
	async afterDelete(entity, actor: Actors, catalog: number, brand: number, id: number, em: EntityManager, fm: FsPatch) { }
	
}