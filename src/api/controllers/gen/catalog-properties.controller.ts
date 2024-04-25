/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/controllers/catalog-properties.controller
 * in a proper way.
 */
import { AuthInfo } from './../../../decorators/auth.decorator';
import { Actors } from './../../../entities/Actors';
import { CreateCatalogPropertyDto } from './../../dtos/create-catalog-property.dto';
import { UpdateCatalogPropertyDto } from './../../dtos/update-catalog-property.dto';
import { CatalogPropertiesService } from './../../services/catalog-properties.service';
import { CatalogsService } from './../../services/catalogs.service';
import { InstanceVersionsService } from './../../services/instance-versions.service';
import { PropertyTypesService } from './../../services/property-types.service';
import { FsPatch } from './../../services/special/files.service';
import { EntityManager } from '@mikro-orm/postgresql';
import { Controller, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiHeader, ApiTags } from '@nestjs/swagger';

@ApiHeader({ name: 'X-API-KEY', required: true, description: 'Ваш идентефикатор апи' })
@UseGuards(AuthGuard('api-key'))
@ApiTags('Catalog properties')
@Controller('catalog/:catalog/properties')
export class GenCatalogPropertiesController {
	constructor(
		protected readonly catalogPropertiesService: CatalogPropertiesService,
		protected readonly catalogsService: CatalogsService,
		protected readonly instanceVersionsService: InstanceVersionsService,
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
		return await this.catalogPropertiesService.listByCatalog(catalog, offset, limit);
	}
	
	async findOne(actor: Actors, catalog: number, id: number) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===actor.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		const entity = await this.catalogPropertiesService.findById(id);
		if(entity===null || !(entity.catalog.id===catalog)){
			throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
		}
		await this.validateRead(entity, actor, catalog, id);
		return entity;
	}
	
	async validateRead(entity, actor: Actors, catalog: number, id: number) { }
	
	async create(actor: Actors, catalog: number, createDto: CreateCatalogPropertyDto) {
		createDto.catalog = catalog;
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===actor.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		return await this.catalogPropertiesService.transactional(async (em, fm) => {
			const existed0 = await this.catalogPropertiesService.findByCatalogAndTitle(catalog, createDto.title, em);
			if(existed0!==null){
				throw new HttpException('Duplicate (catalog, title)', HttpStatus.CONFLICT);
			}
			const tmp = await this.propertyTypesService.findById(createDto.type, em);
			if(tmp===null){
				throw new HttpException('Not found contrainst (type)', HttpStatus.CONFLICT);
			}
			await this.validateCreate(actor, catalog, createDto, em, fm);
			const result = await this.catalogPropertiesService.create(createDto, em);
			await this.afterCreate(result, actor, catalog, createDto, em, fm);
			return result;
		});
	}
	
	async validateCreate(actor: Actors, catalog: number, createDto: CreateCatalogPropertyDto, em: EntityManager, fm: FsPatch) { }
	async afterCreate(entity, actor: Actors, catalog: number, createDto: CreateCatalogPropertyDto, em: EntityManager, fm: FsPatch) { }
	
	async update(actor: Actors, catalog: number, id: number, updateDto: UpdateCatalogPropertyDto) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===actor.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		return await this.catalogPropertiesService.transactional(async (em, fm) => {
			const entity = await this.catalogPropertiesService.findById(id, em);
			if(entity===null || !(entity.catalog.id===catalog)){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			if((updateDto.title!==undefined && updateDto.title!==entity.title)){
				const existed = await this.catalogPropertiesService.findByCatalogAndTitle(entity.catalog.id, updateDto.title, em);
				if(existed!==null && (entity.id!==existed.id)){
					throw new HttpException('Duplicate (catalog, title)', HttpStatus.CONFLICT);
				}
			}
			await this.validateUpdate(entity, actor, catalog, id, updateDto, em, fm);
			const result =  await this.catalogPropertiesService.update(entity, updateDto, em);
			await this.afterUpdate(entity, actor, catalog, id, updateDto, em, fm);
			return result;
		});
	}
	
	async validateUpdate(entity, actor: Actors, catalog: number, id: number, updateDto: UpdateCatalogPropertyDto, em: EntityManager, fm: FsPatch) { }
	async afterUpdate(entity, actor: Actors, catalog: number, id: number, updateDto: UpdateCatalogPropertyDto, em: EntityManager, fm: FsPatch) { }
	
	async delete(actor: Actors, catalog: number, id: number) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===actor.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		return await this.catalogPropertiesService.transactional(async (em, fm) => {
			const entity = await this.catalogPropertiesService.findById(id, em);
			if(entity===null || !(entity.catalog.id===catalog)){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			await this.validateDelete(entity, actor, catalog, id, em, fm);
			await this.catalogPropertiesService.remove(entity, em);
			await this.afterDelete(entity, actor, catalog, id, em, fm);
		});
	}
	
	async validateDelete(entity, actor: Actors, catalog: number, id: number, em: EntityManager, fm: FsPatch) { }
	async afterDelete(entity, actor: Actors, catalog: number, id: number, em: EntityManager, fm: FsPatch) { }
	
}