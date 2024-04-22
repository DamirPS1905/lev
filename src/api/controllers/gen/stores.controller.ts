/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/controllers/stores.controller
 * in a proper way.
 */
import { AuthInfo } from './../../../decorators/auth.decorator';
import { Actors } from './../../../entities/Actors';
import { CreateStoreDto } from './../../dtos/create-store.dto';
import { UpdateStoreDto } from './../../dtos/update-store.dto';
import { InstanceVersionsService } from './../../services/instance-versions.service';
import { FsPatch } from './../../services/special/files.service';
import { StoresService } from './../../services/stores.service';
import { EntityManager } from '@mikro-orm/postgresql';
import { Controller, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiHeader, ApiTags } from '@nestjs/swagger';

@ApiHeader({ name: 'X-API-KEY', required: true, description: 'Ваш идентефикатор апи' })
@UseGuards(AuthGuard('api-key'))
@ApiTags('Stores')
@Controller('store')
export class GenStoresController {
	constructor(
		protected readonly instanceVersionsService: InstanceVersionsService,
		protected readonly storesService: StoresService,
	) { }
	
	async findAll(actor: Actors) {
		return await this.storesService.findAllByCompany(actor.company.id);
	}
	
	async findOne(actor: Actors, id: number) {
		const entity = await this.storesService.findById(id);
		if(entity===null || !(entity.company.id===actor.company.id)){
			throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
		}
		await this.validateRead(entity, actor, id);
		return entity;
	}
	
	async validateRead(entity, actor: Actors, id: number) { }
	
	async create(actor: Actors, createDto: CreateStoreDto) {
		createDto.company = actor.company.id;
		return await this.storesService.transactional(async (em, fm) => {
			const existed0 = await this.storesService.findByCompanyAndTitle(actor.company.id, createDto.title, em);
			if(existed0!==null){
				throw new HttpException('Duplicate (company, title)', HttpStatus.CONFLICT);
			}
			await this.validateCreate(actor, createDto, em, fm);
			const result = await this.storesService.create(createDto, em);
			await this.afterCreate(result, actor, createDto, em, fm);
			return result;
		});
	}
	
	async validateCreate(actor: Actors, createDto: CreateStoreDto, em: EntityManager, fm: FsPatch) { }
	async afterCreate(entity, actor: Actors, createDto: CreateStoreDto, em: EntityManager, fm: FsPatch) { }
	
	async update(actor: Actors, id: number, updateDto: UpdateStoreDto) {
		return await this.storesService.transactional(async (em, fm) => {
			const entity = await this.storesService.findById(id, em);
			if(entity===null || !(entity.company.id===actor.company.id)){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			if((updateDto.title!==undefined && updateDto.title!==entity.title)){
				const existed = await this.storesService.findByCompanyAndTitle(entity.company.id, updateDto.title, em);
				if(existed!==null && (entity.id!==existed.id)){
					throw new HttpException('Duplicate (company, title)', HttpStatus.CONFLICT);
				}
			}
			await this.validateUpdate(entity, actor, id, updateDto, em, fm);
			return await this.storesService.update(entity, updateDto, em);
		});
	}
	
	async validateUpdate(entity, actor: Actors, id: number, updateDto: UpdateStoreDto, em: EntityManager, fm: FsPatch) { }
	async afterUpdate(entity, actor: Actors, id: number, updateDto: UpdateStoreDto, em: EntityManager, fm: FsPatch) { }
	
	async delete(actor: Actors, id: number) {
		return await this.storesService.transactional(async (em, fm) => {
			const entity = await this.storesService.findById(id, em);
			if(entity===null || !(entity.company.id===actor.company.id)){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			await this.validateDelete(entity, actor, id, em, fm);
			await this.storesService.remove(entity, em);
			await this.afterDelete(entity, actor, id, em, fm);
		});
	}
	
	async validateDelete(entity, actor: Actors, id: number, em: EntityManager, fm: FsPatch) { }
	async afterDelete(entity, actor: Actors, id: number, em: EntityManager, fm: FsPatch) { }
	
}