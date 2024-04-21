/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/controllers/unit-groups.controller
 * in a proper way.
 */
import { AuthInfo } from './../../../decorators/auth.decorator';
import { Actors } from './../../../entities/Actors';
import { CreateUnitGroupDto } from './../../dtos/create-unit-group.dto';
import { UpdateUnitGroupDto } from './../../dtos/update-unit-group.dto';
import { FsPatch } from './../../services/special/files.service';
import { UnitGroupsService } from './../../services/unit-groups.service';
import { UnitsService } from './../../services/units.service';
import { EntityManager } from '@mikro-orm/postgresql';
import { Controller, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiHeader, ApiTags } from '@nestjs/swagger';

@ApiHeader({ name: 'X-API-KEY', required: true, description: 'Ваш идентефикатор апи' })
@UseGuards(AuthGuard('api-key'))
@ApiTags('Unit groups')
@Controller('unit-group')
export class GenUnitGroupsController {
	constructor(
		protected readonly unitGroupsService: UnitGroupsService,
		protected readonly unitsService: UnitsService,
	) { }
	
	async findAll(actor: Actors) {
		return await this.unitGroupsService.findAllByCompany(actor.company.id);
	}
	
	async findOne(actor: Actors, id: number) {
		const entity = await this.unitGroupsService.findById(id);
		if(entity===null || !(entity.company===null || entity.company.id===actor.company.id)){
			throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
		}
		await this.validateRead(entity, actor, id);
		return entity;
	}
	
	async validateRead(entity, actor: Actors, id: number) { }
	
	async create(actor: Actors, createDto: CreateUnitGroupDto) {
		createDto.company = actor.company.id;
		return await this.unitGroupsService.transactional(async (em, fm) => {
			await this.validateCreate(actor, createDto, em, fm);
			const result = await this.unitGroupsService.create(createDto, em);
			await this.afterCreate(result, actor, createDto, em, fm);
			return result;
		});
	}
	
	async validateCreate(actor: Actors, createDto: CreateUnitGroupDto, em: EntityManager, fm: FsPatch) { }
	async afterCreate(entity, actor: Actors, createDto: CreateUnitGroupDto, em: EntityManager, fm: FsPatch) { }
	
	async update(actor: Actors, id: number, updateDto: UpdateUnitGroupDto) {
		return await this.unitGroupsService.transactional(async (em, fm) => {
			const entity = await this.unitGroupsService.findById(id, em);
			if(updateDto.base!==null){
				if(updateDto.base!==undefined){
					const baseIns = await this.unitsService.findById(updateDto.base);
					if(updateDto.base!==null){
						if(baseIns===null || !(baseIns.group.id===entity.id)){
							throw new HttpException('Unit not found in group', HttpStatus.NOT_FOUND);
						}
					}
				}
			}
			if(entity===null || !(entity.company!==null && entity.company.id===actor.company.id)){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			await this.validateUpdate(entity, actor, id, updateDto, em, fm);
			return await this.unitGroupsService.update(entity, updateDto, em);
		});
	}
	
	async validateUpdate(entity, actor: Actors, id: number, updateDto: UpdateUnitGroupDto, em: EntityManager, fm: FsPatch) { }
	async afterUpdate(entity, actor: Actors, id: number, updateDto: UpdateUnitGroupDto, em: EntityManager, fm: FsPatch) { }
	
	async delete(actor: Actors, id: number) {
		return await this.unitGroupsService.transactional(async (em, fm) => {
			const entity = await this.unitGroupsService.findById(id, em);
			if(entity===null || !(entity.company!==null && entity.company.id===actor.company.id)){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			await this.validateDelete(entity, actor, id, em, fm);
			await this.unitGroupsService.remove(entity, em);
			await this.afterDelete(entity, actor, id, em, fm);
		});
	}
	
	async validateDelete(entity, actor: Actors, id: number, em: EntityManager, fm: FsPatch) { }
	async afterDelete(entity, actor: Actors, id: number, em: EntityManager, fm: FsPatch) { }
	
}