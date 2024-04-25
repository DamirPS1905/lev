/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/controllers/catalogs.controller
 * in a proper way.
 */
import { AuthInfo } from './../../../decorators/auth.decorator';
import { Actors } from './../../../entities/Actors';
import { CreateCatalogDto } from './../../dtos/create-catalog.dto';
import { UpdateCatalogDto } from './../../dtos/update-catalog.dto';
import { CatalogsService } from './../../services/catalogs.service';
import { FsPatch } from './../../services/special/files.service';
import { EntityManager } from '@mikro-orm/postgresql';
import { Controller, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiHeader, ApiTags } from '@nestjs/swagger';

@ApiHeader({ name: 'X-API-KEY', required: true, description: 'Ваш идентефикатор апи' })
@UseGuards(AuthGuard('api-key'))
@ApiTags('Catalogs')
@Controller('catalog')
export class GenCatalogsController {
	constructor(
		protected readonly catalogsService: CatalogsService,
	) { }
	
	async findAll(actor: Actors) {
		return await this.catalogsService.findAllByCompany(actor.company.id);
	}
	
	async create(actor: Actors, createDto: CreateCatalogDto) {
		createDto.company = actor.company.id;
		return await this.catalogsService.transactional(async (em, fm) => {
			const existed0 = await this.catalogsService.findByTitleAndCompany(createDto.title, actor.company.id, em);
			if(existed0!==null){
				throw new HttpException('Duplicate (title, company)', HttpStatus.CONFLICT);
			}
			await this.validateCreate(actor, createDto, em, fm);
			const result = await this.catalogsService.create(createDto, em);
			await this.afterCreate(result, actor, createDto, em, fm);
			return result;
		});
	}
	
	async validateCreate(actor: Actors, createDto: CreateCatalogDto, em: EntityManager, fm: FsPatch) { }
	async afterCreate(entity, actor: Actors, createDto: CreateCatalogDto, em: EntityManager, fm: FsPatch) { }
	
	async update(actor: Actors, id: number, updateDto: UpdateCatalogDto) {
		return await this.catalogsService.transactional(async (em, fm) => {
			const entity = await this.catalogsService.findById(id, em);
			if(entity===null || !(entity.company.id===actor.company.id)){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			if((updateDto.title!==undefined && updateDto.title!==entity.title)){
				const existed = await this.catalogsService.findByTitleAndCompany(updateDto.title, entity.company.id, em);
				if(existed!==null && (entity.id!==existed.id)){
					throw new HttpException('Duplicate (title, company)', HttpStatus.CONFLICT);
				}
			}
			await this.validateUpdate(entity, actor, id, updateDto, em, fm);
			const result =  await this.catalogsService.update(entity, updateDto, em);
			await this.afterUpdate(entity, actor, id, updateDto, em, fm);
			return result;
		});
	}
	
	async validateUpdate(entity, actor: Actors, id: number, updateDto: UpdateCatalogDto, em: EntityManager, fm: FsPatch) { }
	async afterUpdate(entity, actor: Actors, id: number, updateDto: UpdateCatalogDto, em: EntityManager, fm: FsPatch) { }
	
	async delete(actor: Actors, id: number) {
		return await this.catalogsService.transactional(async (em, fm) => {
			const entity = await this.catalogsService.findById(id, em);
			if(entity===null || !(entity.company.id===actor.company.id)){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			await this.validateDelete(entity, actor, id, em, fm);
			await this.catalogsService.remove(entity, em);
			await this.afterDelete(entity, actor, id, em, fm);
		});
	}
	
	async validateDelete(entity, actor: Actors, id: number, em: EntityManager, fm: FsPatch) { }
	async afterDelete(entity, actor: Actors, id: number, em: EntityManager, fm: FsPatch) { }
	
}