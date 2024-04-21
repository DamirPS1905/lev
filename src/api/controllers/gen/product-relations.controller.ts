/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/controllers/product-relations.controller
 * in a proper way.
 */
import { AuthInfo } from './../../../decorators/auth.decorator';
import { Actors } from './../../../entities/Actors';
import { CreateProductRelationDto } from './../../dtos/create-product-relation.dto';
import { UpdateProductRelationDto } from './../../dtos/update-product-relation.dto';
import { CatalogsService } from './../../services/catalogs.service';
import { ProductRelationsService } from './../../services/product-relations.service';
import { ProductsRelationKindsService } from './../../services/products-relation-kinds.service';
import { FsPatch } from './../../services/special/files.service';
import { EntityManager } from '@mikro-orm/postgresql';
import { Controller, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiHeader, ApiTags } from '@nestjs/swagger';

@ApiHeader({ name: 'X-API-KEY', required: true, description: 'Ваш идентефикатор апи' })
@UseGuards(AuthGuard('api-key'))
@ApiTags('Product relations')
@Controller('catalog/:catalog/product-relation')
export class GenProductRelationsController {
	constructor(
		protected readonly catalogsService: CatalogsService,
		protected readonly productRelationsService: ProductRelationsService,
		protected readonly productsRelationKindsService: ProductsRelationKindsService,
	) { }
	
	async findAll(actor: Actors, catalog: number) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===actor.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		return await this.productRelationsService.findAllByCatalog(catalog);
	}
	
	async findOne(actor: Actors, catalog: number, id: number) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===actor.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		const entity = await this.productRelationsService.findById(id);
		if(entity===null || !(entity.catalog.id===catalog)){
			throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
		}
		await this.validateRead(entity, actor, catalog, id);
		return entity;
	}
	
	async validateRead(entity, actor: Actors, catalog: number, id: number) { }
	
	async create(actor: Actors, catalog: number, createDto: CreateProductRelationDto) {
		createDto.catalog = catalog;
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===actor.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		return await this.productRelationsService.transactional(async (em, fm) => {
			const existed0 = await this.productRelationsService.findByCatalogAndTitle(catalog, createDto.title, em);
			if(existed0!==null){
				throw new HttpException('Duplicate (catalog, title)', HttpStatus.CONFLICT);
			}
			if(createDto.kind!==undefined){
				const kindIns = await this.productsRelationKindsService.findById(createDto.kind);
				if(kindIns===null){
					throw new HttpException('Unknown relations kind', HttpStatus.NOT_FOUND);
				}
			}
			await this.validateCreate(actor, catalog, createDto, em, fm);
			const result = await this.productRelationsService.create(createDto, em);
			await this.afterCreate(result, actor, catalog, createDto, em, fm);
			return result;
		});
	}
	
	async validateCreate(actor: Actors, catalog: number, createDto: CreateProductRelationDto, em: EntityManager, fm: FsPatch) { }
	async afterCreate(entity, actor: Actors, catalog: number, createDto: CreateProductRelationDto, em: EntityManager, fm: FsPatch) { }
	
	async update(actor: Actors, catalog: number, id: number, updateDto: UpdateProductRelationDto) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===actor.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		return await this.productRelationsService.transactional(async (em, fm) => {
			const entity = await this.productRelationsService.findById(id, em);
			if(updateDto.kind!==undefined){
				const kindIns = await this.productsRelationKindsService.findById(updateDto.kind);
				if(kindIns===null){
					throw new HttpException('Unknown relations kind', HttpStatus.NOT_FOUND);
				}
			}
			if(entity===null || !(entity.catalog.id===catalog)){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			if((updateDto.title!==undefined && updateDto.title!==entity.title)){
				const existed = await this.productRelationsService.findByCatalogAndTitle(entity.catalog.id, updateDto.title, em);
				if(existed!==null && (entity.id!==existed.id)){
					throw new HttpException('Duplicate (catalog, title)', HttpStatus.CONFLICT);
				}
			}
			await this.validateUpdate(entity, actor, catalog, id, updateDto, em, fm);
			return await this.productRelationsService.update(entity, updateDto, em);
		});
	}
	
	async validateUpdate(entity, actor: Actors, catalog: number, id: number, updateDto: UpdateProductRelationDto, em: EntityManager, fm: FsPatch) { }
	async afterUpdate(entity, actor: Actors, catalog: number, id: number, updateDto: UpdateProductRelationDto, em: EntityManager, fm: FsPatch) { }
	
	async delete(actor: Actors, catalog: number, id: number) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===actor.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		return await this.productRelationsService.transactional(async (em, fm) => {
			const entity = await this.productRelationsService.findById(id, em);
			if(entity===null || !(entity.catalog.id===catalog)){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			await this.validateDelete(entity, actor, catalog, id, em, fm);
			await this.productRelationsService.remove(entity, em);
			await this.afterDelete(entity, actor, catalog, id, em, fm);
		});
	}
	
	async validateDelete(entity, actor: Actors, catalog: number, id: number, em: EntityManager, fm: FsPatch) { }
	async afterDelete(entity, actor: Actors, catalog: number, id: number, em: EntityManager, fm: FsPatch) { }
	
}