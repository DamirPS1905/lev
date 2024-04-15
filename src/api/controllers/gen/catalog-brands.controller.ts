/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/controllers/catalog-brands.controller
 * in a proper way.
 */
import { AuthInfo } from './../../../decorators/auth.decorator';
import { Actors } from './../../../entities/Actors';
import { CreateCatalogBrandDto } from './../../dtos/create-catalog-brand.dto';
import { UpdateCatalogBrandDto } from './../../dtos/update-catalog-brand.dto';
import { CatalogBrandsService } from './../../services/catalog-brands.service';
import { CatalogsService } from './../../services/catalogs.service';
import { EntityManager } from '@mikro-orm/postgresql';
import { Controller, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiHeader, ApiTags } from '@nestjs/swagger';

@ApiHeader({ name: 'X-API-KEY', required: true, description: 'Ваш идентефикатор апи' })
@UseGuards(AuthGuard('api-key'))
@ApiTags('Catalog brands')
@Controller('catalog/:catalog/brand')
export class GenCatalogBrandsController {
	constructor(
		protected readonly catalogBrandsService: CatalogBrandsService,
		protected readonly catalogsService: CatalogsService,
	) { }
	
	async findAll(actor: Actors, catalog: number, offset: number, limit: number) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===actor.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		if(offset<0) throw new HttpException('Wrong offset value', HttpStatus.BAD_REQUEST);
		if(limit<0) throw new HttpException('Wrong limit value', HttpStatus.BAD_REQUEST);
		if(limit>1000) limit = 1000;
		return await this.catalogBrandsService.listByCatalog(catalog, offset, limit);
	}
	
	async findOne(actor: Actors, catalog: number, id: number) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===actor.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		const entity = await this.catalogBrandsService.findById(id);
		if(entity===null || !(entity.catalog.id===catalog)){
			throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
		}
		await this.validateRead(entity, actor, catalog, id);
		return entity;
	}
	
	async validateRead(entity, actor: Actors, catalog: number, id: number) { }
	
	async create(actor: Actors, catalog: number, createDto: CreateCatalogBrandDto) {
		createDto.catalog = catalog;
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===actor.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		return await this.catalogBrandsService.transactional(async (em) => {
			const existed0 = await this.catalogBrandsService.findByCatalogAndTitle(catalog, createDto.title, em);
			if(existed0!==null){
				throw new HttpException('Duplicate (catalog, title)', HttpStatus.CONFLICT);
			}
			await this.validateCreate(actor, catalog, createDto, em);
			return await this.catalogBrandsService.create(createDto, em);
		});
	}
	
	async validateCreate(actor: Actors, catalog: number, createDto: CreateCatalogBrandDto, em: EntityManager) { }
	
	async update(actor: Actors, catalog: number, id: number, updateDto: UpdateCatalogBrandDto) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===actor.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		return await this.catalogBrandsService.transactional(async (em) => {
			const entity = await this.catalogBrandsService.findById(id, em);
			if(entity===null || !(entity.catalog.id===catalog)){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			if((updateDto.title!==undefined && updateDto.title!==entity.title)){
				const existed = await this.catalogBrandsService.findByCatalogAndTitle(entity.catalog.id, updateDto.title, em);
				if(existed!==null && (entity.id!==existed.id)){
					throw new HttpException('Duplicate (catalog, title)', HttpStatus.CONFLICT);
				}
			}
			await this.validateUpdate(entity, actor, catalog, id, updateDto, em);
			return await this.catalogBrandsService.update(entity, updateDto, em);
		});
	}
	
	async validateUpdate(entity, actor: Actors, catalog: number, id: number, updateDto: UpdateCatalogBrandDto, em: EntityManager) { }
	
	async delete(actor: Actors, catalog: number, id: number) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===actor.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		return await this.catalogBrandsService.transactional(async (em) => {
			const entity = await this.catalogBrandsService.findById(id, em);
			if(entity===null || !(entity.catalog.id===catalog)){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			await this.validateDelete(entity, actor, catalog, id, em);
			return await this.catalogBrandsService.remove(entity, em);
		});
	}
	
	async validateDelete(entity, actor: Actors, catalog: number, id: number, em: EntityManager) { }
	
}