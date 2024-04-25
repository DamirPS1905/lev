/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/controllers/units.controller
 * in a proper way.
 */
import { AuthInfo } from './../../../decorators/auth.decorator';
import { Actors } from './../../../entities/Actors';
import { CreateUnitDto } from './../../dtos/create-unit.dto';
import { UpdateUnitDto } from './../../dtos/update-unit.dto';
import { InstanceVersionsService } from './../../services/instance-versions.service';
import { FsPatch } from './../../services/special/files.service';
import { UnitGroupsService } from './../../services/unit-groups.service';
import { UnitsService } from './../../services/units.service';
import { EntityManager } from '@mikro-orm/postgresql';
import { Controller, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiHeader, ApiTags } from '@nestjs/swagger';

@ApiHeader({ name: 'X-API-KEY', required: true, description: 'Ваш идентефикатор апи' })
@UseGuards(AuthGuard('api-key'))
@ApiTags('Units')
@Controller('unit-group/:group/units')
export class GenUnitsController {
	constructor(
		protected readonly instanceVersionsService: InstanceVersionsService,
		protected readonly unitGroupsService: UnitGroupsService,
		protected readonly unitsService: UnitsService,
	) { }
	
	async findAll(actor: Actors, group: number) {
		const groupIns = await this.unitGroupsService.findById(group);
		if(groupIns===null || !(groupIns.company===null || groupIns.company.id===actor.company.id)){
			throw new HttpException('Units group not found', HttpStatus.NOT_FOUND);
		}
		return await this.unitsService.findAllByCompany(actor.company.id);
	}
	
	async findOne(actor: Actors, group: number, id: number) {
		const groupIns = await this.unitGroupsService.findById(group);
		if(groupIns===null || !(groupIns.company===null || groupIns.company.id===actor.company.id)){
			throw new HttpException('Units group not found', HttpStatus.NOT_FOUND);
		}
		const entity = await this.unitsService.findById(id);
		if(entity===null || !(entity.company===null || entity.company.id===actor.company.id) || !(entity.group.id===group)){
			throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
		}
		await this.validateRead(entity, actor, group, id);
		return entity;
	}
	
	async validateRead(entity, actor: Actors, group: number, id: number) { }
	
	async create(actor: Actors, group: number, createDto: CreateUnitDto) {
		createDto.company = actor.company.id;
		createDto.group = group;
		const groupIns = await this.unitGroupsService.findById(group);
		if(groupIns===null || !(groupIns.company===null || groupIns.company.id===actor.company.id)){
			throw new HttpException('Units group not found', HttpStatus.NOT_FOUND);
		}
		return await this.unitsService.transactional(async (em, fm) => {
			await this.validateCreate(actor, group, createDto, em, fm);
			const result = await this.unitsService.create(createDto, em);
			await this.afterCreate(result, actor, group, createDto, em, fm);
			return result;
		});
	}
	
	async validateCreate(actor: Actors, group: number, createDto: CreateUnitDto, em: EntityManager, fm: FsPatch) { }
	async afterCreate(entity, actor: Actors, group: number, createDto: CreateUnitDto, em: EntityManager, fm: FsPatch) { }
	
	async update(actor: Actors, group: number, id: number, updateDto: UpdateUnitDto) {
		const groupIns = await this.unitGroupsService.findById(group);
		if(groupIns===null || !(groupIns.company===null || groupIns.company.id===actor.company.id)){
			throw new HttpException('Units group not found', HttpStatus.NOT_FOUND);
		}
		return await this.unitsService.transactional(async (em, fm) => {
			const entity = await this.unitsService.findById(id, em);
			if(entity===null || !(entity.company!==null && entity.company.id===actor.company.id) || !(entity.group.id===group)){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			await this.validateUpdate(entity, actor, group, id, updateDto, em, fm);
			const result =  await this.unitsService.update(entity, updateDto, em);
			await this.afterUpdate(entity, actor, group, id, updateDto, em, fm);
			return result;
		});
	}
	
	async validateUpdate(entity, actor: Actors, group: number, id: number, updateDto: UpdateUnitDto, em: EntityManager, fm: FsPatch) { }
	async afterUpdate(entity, actor: Actors, group: number, id: number, updateDto: UpdateUnitDto, em: EntityManager, fm: FsPatch) { }
	
	async delete(actor: Actors, group: number, id: number) {
		const groupIns = await this.unitGroupsService.findById(group);
		if(groupIns===null || !(groupIns.company===null || groupIns.company.id===actor.company.id)){
			throw new HttpException('Units group not found', HttpStatus.NOT_FOUND);
		}
		return await this.unitsService.transactional(async (em, fm) => {
			const entity = await this.unitsService.findById(id, em);
			if(entity===null || !(entity.company!==null && entity.company.id===actor.company.id) || !(entity.group.id===group)){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			await this.validateDelete(entity, actor, group, id, em, fm);
			await this.unitsService.remove(entity, em);
			await this.afterDelete(entity, actor, group, id, em, fm);
		});
	}
	
	async validateDelete(entity, actor: Actors, group: number, id: number, em: EntityManager, fm: FsPatch) { }
	async afterDelete(entity, actor: Actors, group: number, id: number, em: EntityManager, fm: FsPatch) { }
	
}