/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/controllers/catalog-types.controller
 * in a proper way.
 */
import { AuthInfo } from './../../../decorators/auth.decorator';
import { Actors } from './../../../entities/Actors';
import { CreateCatalogTypeDto } from './../../dtos/create-catalog-type.dto';
import { UpdateCatalogTypeDto } from './../../dtos/update-catalog-type.dto';
import { CatalogTypesOverloadService } from './../../services/catalog-types-overload.service';
import { CatalogTypesService } from './../../services/catalog-types.service';
import { CatalogsService } from './../../services/catalogs.service';
import { FileLoadTasksService } from './../../services/file-load-tasks.service';
import { PropertyInTypesService } from './../../services/property-in-types.service';
import { FsPatch } from './../../services/special/files.service';
import { EntityManager } from '@mikro-orm/postgresql';
import { Controller, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiHeader, ApiTags } from '@nestjs/swagger';

@ApiHeader({ name: 'X-API-KEY', required: true, description: 'Ваш идентефикатор апи' })
@UseGuards(AuthGuard('api-key'))
@ApiTags('Catalog types')
@Controller('catalog/:catalog/type')
export class GenCatalogTypesController {
	constructor(
		protected readonly catalogTypesOverloadService: CatalogTypesOverloadService,
		protected readonly catalogTypesService: CatalogTypesService,
		protected readonly catalogsService: CatalogsService,
		protected readonly fileLoadTasksService: FileLoadTasksService,
		protected readonly propertyInTypesService: PropertyInTypesService,
	) { }
	
	async findAll(actor: Actors, catalog: number, offset: number, limit: number) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===actor.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		if(offset<0) throw new HttpException('Wrong offset value', HttpStatus.BAD_REQUEST);
		if(limit<0) throw new HttpException('Wrong limit value', HttpStatus.BAD_REQUEST);
		if(limit>1000) limit = 1000;
		return await this.catalogTypesService.listByCatalog(catalog, offset, limit);
	}
	
	async findOne(actor: Actors, catalog: number, id: number) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===actor.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		const entity = await this.catalogTypesService.findById(id);
		if(entity===null || !(entity.catalog.id===catalog)){
			throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
		}
		await this.validateRead(entity, actor, catalog, id);
		return entity;
	}
	
	async validateRead(entity, actor: Actors, catalog: number, id: number) { }
	
	async create(actor: Actors, catalog: number, createDto: CreateCatalogTypeDto) {
		createDto.catalog = catalog;
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===actor.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		return await this.catalogTypesService.transactional(async (em, fm) => {
			const existed1 = await this.catalogTypesService.findByTitleAndParent(createDto.title, createDto.parent, em);
			if(existed1!==null){
				throw new HttpException('Duplicate (title, parent)', HttpStatus.CONFLICT);
			}
			if(createDto.parent!==null){
				if(createDto.parent!==undefined){
					const parentIns = await this.catalogTypesService.findById(createDto.parent);
					if(createDto.parent!==null){
						if(parentIns===null || !(parentIns.catalog.id===catalog)){
							throw new HttpException('Parent type not found', HttpStatus.CONFLICT);
						}
					}
				}
			}
			await this.validateCreate(actor, catalog, createDto, em, fm);
			const result = await this.catalogTypesService.create(createDto, em);
			await this.afterCreate(result, actor, catalog, createDto, em, fm);
			return result;
		});
	}
	
	async validateCreate(actor: Actors, catalog: number, createDto: CreateCatalogTypeDto, em: EntityManager, fm: FsPatch) { }
	async afterCreate(entity, actor: Actors, catalog: number, createDto: CreateCatalogTypeDto, em: EntityManager, fm: FsPatch) { }
	
	async update(actor: Actors, catalog: number, id: number, updateDto: UpdateCatalogTypeDto) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===actor.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		return await this.catalogTypesService.transactional(async (em, fm) => {
			const entity = await this.catalogTypesService.findById(id, em);
			if(updateDto.parent!==null){
				if(updateDto.parent!==undefined){
					const parentIns = await this.catalogTypesService.findById(updateDto.parent);
					if(updateDto.parent!==null){
						if(parentIns===null || !(parentIns.catalog.id===catalog)){
							throw new HttpException('Parent type not found', HttpStatus.CONFLICT);
						}
					}
				}
			}
			if(entity===null || !(entity.catalog.id===catalog)){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			if((updateDto.title!==undefined && updateDto.title!==entity.title) || (updateDto.parent!==undefined && updateDto.parent!==entity.parent.id)){
				const existed = await this.catalogTypesService.findByTitleAndParent(updateDto.title, updateDto.parent, em);
				if(existed!==null && (entity.id!==existed.id)){
					throw new HttpException('Duplicate (title, parent)', HttpStatus.CONFLICT);
				}
			}
			await this.validateUpdate(entity, actor, catalog, id, updateDto, em, fm);
			return await this.catalogTypesService.update(entity, updateDto, em);
		});
	}
	
	async validateUpdate(entity, actor: Actors, catalog: number, id: number, updateDto: UpdateCatalogTypeDto, em: EntityManager, fm: FsPatch) { }
	async afterUpdate(entity, actor: Actors, catalog: number, id: number, updateDto: UpdateCatalogTypeDto, em: EntityManager, fm: FsPatch) { }
	
	async delete(actor: Actors, catalog: number, id: number) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===actor.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		return await this.catalogTypesService.transactional(async (em, fm) => {
			const entity = await this.catalogTypesService.findById(id, em);
			if(entity===null || !(entity.catalog.id===catalog)){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			await this.validateDelete(entity, actor, catalog, id, em, fm);
			await this.catalogTypesService.remove(entity, em);
			await this.afterDelete(entity, actor, catalog, id, em, fm);
		});
	}
	
	async validateDelete(entity, actor: Actors, catalog: number, id: number, em: EntityManager, fm: FsPatch) { }
	async afterDelete(entity, actor: Actors, catalog: number, id: number, em: EntityManager, fm: FsPatch) { }
	
}