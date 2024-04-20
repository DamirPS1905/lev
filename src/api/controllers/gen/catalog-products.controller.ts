/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/controllers/catalog-products.controller
 * in a proper way.
 */
import { AuthInfo } from './../../../decorators/auth.decorator';
import { Actors } from './../../../entities/Actors';
import { CreateCatalogProductDto } from './../../dtos/create-catalog-product.dto';
import { UpdateCatalogProductDto } from './../../dtos/update-catalog-product.dto';
import { CatalogBrandCollectionsService } from './../../services/catalog-brand-collections.service';
import { CatalogBrandsService } from './../../services/catalog-brands.service';
import { CatalogProductOffersService } from './../../services/catalog-product-offers.service';
import { CatalogProductsService } from './../../services/catalog-products.service';
import { CatalogTypesService } from './../../services/catalog-types.service';
import { CatalogsService } from './../../services/catalogs.service';
import { FileLoadTasksService } from './../../services/file-load-tasks.service';
import { UnitsService } from './../../services/units.service';
import { EntityManager } from '@mikro-orm/postgresql';
import { Controller, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiHeader, ApiTags } from '@nestjs/swagger';

@ApiHeader({ name: 'X-API-KEY', required: true, description: 'Ваш идентефикатор апи' })
@UseGuards(AuthGuard('api-key'))
@ApiTags('Catalog products')
@Controller('catalog/:catalog/products')
export class GenCatalogProductsController {
	constructor(
		protected readonly catalogBrandCollectionsService: CatalogBrandCollectionsService,
		protected readonly catalogBrandsService: CatalogBrandsService,
		protected readonly catalogProductOffersService: CatalogProductOffersService,
		protected readonly catalogProductsService: CatalogProductsService,
		protected readonly catalogTypesService: CatalogTypesService,
		protected readonly catalogsService: CatalogsService,
		protected readonly fileLoadTasksService: FileLoadTasksService,
		protected readonly unitsService: UnitsService,
	) { }
	
	async findAll(actor: Actors, catalog: number, offset: number, limit: number) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===actor.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		if(offset<0) throw new HttpException('Wrong offset value', HttpStatus.BAD_REQUEST);
		if(limit<0) throw new HttpException('Wrong limit value', HttpStatus.BAD_REQUEST);
		if(limit>1000) limit = 1000;
		return await this.catalogProductsService.listByCatalog(catalog, offset, limit);
	}
	
	async findOne(actor: Actors, catalog: number, id: bigint) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===actor.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		const entity = await this.catalogProductsService.findById(id);
		if(entity===null || !(entity.catalog.id===catalog)){
			throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
		}
		await this.validateRead(entity, actor, catalog, id);
		return entity;
	}
	
	async validateRead(entity, actor: Actors, catalog: number, id: bigint) { }
	
	async create(actor: Actors, catalog: number, createDto: CreateCatalogProductDto) {
		createDto.catalog = catalog;
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===actor.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		return await this.catalogProductsService.transactional(async (em) => {
			const existed0 = await this.catalogProductsService.findByCatalogAndTitle(catalog, createDto.title, em);
			if(existed0!==null){
				throw new HttpException('Duplicate (catalog, title)', HttpStatus.CONFLICT);
			}
			const brandIns = await this.catalogBrandsService.findById(createDto.brand);
			if(brandIns===null || !(brandIns.catalog.id===catalog)){
				throw new HttpException('Brand not found', HttpStatus.CONFLICT);
			}
			const typeIns = await this.catalogTypesService.findById(createDto.type);
			if(typeIns===null || !(typeIns.catalog.id===catalog)){
				throw new HttpException('Type not found', HttpStatus.CONFLICT);
			}
			if(createDto.collection!==null){
				if(createDto.collection!==undefined){
					const tmp = await this.catalogBrandCollectionsService.findById(createDto.collection, em);
					if(tmp===null){
						throw new HttpException('Not found contrainst (collection)', HttpStatus.CONFLICT);
					}
				}
			}
			const accountingUnitIns = await this.unitsService.findById(createDto.accountingUnit);
			if(accountingUnitIns===null || !(accountingUnitIns.company===null || accountingUnitIns.company.id===actor.company.id)){
				throw new HttpException('Unit not found', HttpStatus.NOT_FOUND);
			}
			await this.validateCreate(actor, catalog, createDto, em);
			return await this.catalogProductsService.create(createDto, em);
		});
	}
	
	async validateCreate(actor: Actors, catalog: number, createDto: CreateCatalogProductDto, em: EntityManager) { }
	
	async update(actor: Actors, catalog: number, id: bigint, updateDto: UpdateCatalogProductDto) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===actor.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		return await this.catalogProductsService.transactional(async (em) => {
			const entity = await this.catalogProductsService.findById(id, em);
			if(updateDto.brand!==undefined){
				const brandIns = await this.catalogBrandsService.findById(updateDto.brand);
				if(brandIns===null || !(brandIns.catalog.id===catalog)){
					throw new HttpException('Brand not found', HttpStatus.CONFLICT);
				}
			}
			if(updateDto.type!==undefined){
				const typeIns = await this.catalogTypesService.findById(updateDto.type);
				if(typeIns===null || !(typeIns.catalog.id===catalog)){
					throw new HttpException('Type not found', HttpStatus.CONFLICT);
				}
			}
			if(updateDto.collection!==null){
				if(updateDto.collection!==undefined){
					const tmp = await this.catalogBrandCollectionsService.findById(updateDto.collection, em);
					if(tmp===null){
						throw new HttpException('Not found contrainst (collection)', HttpStatus.CONFLICT);
					}
				}
			}
			if(updateDto.accountingUnit!==undefined){
				const accountingUnitIns = await this.unitsService.findById(updateDto.accountingUnit);
				if(accountingUnitIns===null || !(accountingUnitIns.company===null || accountingUnitIns.company.id===actor.company.id)){
					throw new HttpException('Unit not found', HttpStatus.NOT_FOUND);
				}
			}
			if(entity===null || !(entity.catalog.id===catalog)){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			if((updateDto.title!==undefined && updateDto.title!==entity.title)){
				const existed = await this.catalogProductsService.findByCatalogAndTitle(entity.catalog.id, updateDto.title, em);
				if(existed!==null && (entity.id!==existed.id)){
					throw new HttpException('Duplicate (catalog, title)', HttpStatus.CONFLICT);
				}
			}
			await this.validateUpdate(entity, actor, catalog, id, updateDto, em);
			return await this.catalogProductsService.update(entity, updateDto, em);
		});
	}
	
	async validateUpdate(entity, actor: Actors, catalog: number, id: bigint, updateDto: UpdateCatalogProductDto, em: EntityManager) { }
	
	async delete(actor: Actors, catalog: number, id: bigint) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===actor.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		return await this.catalogProductsService.transactional(async (em) => {
			const entity = await this.catalogProductsService.findById(id, em);
			if(entity===null || !(entity.catalog.id===catalog)){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			await this.validateDelete(entity, actor, catalog, id, em);
			return await this.catalogProductsService.remove(entity, em);
		});
	}
	
	async validateDelete(entity, actor: Actors, catalog: number, id: bigint, em: EntityManager) { }
	
}