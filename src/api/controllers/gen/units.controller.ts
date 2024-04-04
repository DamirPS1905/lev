/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/controllers/units.controller
 * in a proper way.
 */
import { AuthInfo } from './../../../decorators/auth.decorator'
import { ApiKeys } from './../../../entities/ApiKeys'
import { CreateUnitDto } from './../../dtos/create-unit.dto'
import { UpdateUnitDto } from './../../dtos/update-unit.dto'
import { UnitGroupsService } from './../../services/unit-groups.service'
import { UnitsService } from './../../services/units.service'
import { EntityManager } from '@mikro-orm/postgresql'
import { Controller, HttpException, HttpStatus, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiHeader, ApiTags } from '@nestjs/swagger'

@ApiHeader({ name: 'X-API-KEY', required: true })
@UseGuards(AuthGuard('api-key'))
@ApiTags('Units')
@Controller('unit-group/:group/units')
export class GenUnitsController {
	constructor(
		protected readonly unitGroupsService: UnitGroupsService,
		protected readonly unitsService: UnitsService,
	) { }
	
	async findAll(apiKey: ApiKeys, group: number, offset: number, limit: number) {
		const groupIns = await this.unitGroupsService.findById(group);
		if(groupIns===null || !(groupIns.company===null || groupIns.company.id===apiKey.company.id)){
			throw new HttpException('Units group not found', HttpStatus.NOT_FOUND);
		}
		if(offset<0) throw new HttpException('Wrong offset value', HttpStatus.BAD_REQUEST);
		if(limit<0) throw new HttpException('Wrong limit value', HttpStatus.BAD_REQUEST);
		if(limit>1000) limit = 1000;
		return await this.unitsService.listByCompany(apiKey.company.id, offset, limit);
	}
	
	async findOne(apiKey: ApiKeys, group: number, id: number) {
		const groupIns = await this.unitGroupsService.findById(group);
		if(groupIns===null || !(groupIns.company===null || groupIns.company.id===apiKey.company.id)){
			throw new HttpException('Units group not found', HttpStatus.NOT_FOUND);
		}
		const entity = await this.unitsService.findById(id);
		if(entity===null || !(entity.company===null || entity.company.id===apiKey.company.id) || !(entity.group.id===group)){
			throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
		}
		await this.validateRead(entity, apiKey, group, id);
		return entity;
	}
	
	async validateRead(entity, apiKey: ApiKeys, group: number, id: number) { }
	
	async create(apiKey: ApiKeys, group: number, createDto: CreateUnitDto) {
		createDto.company = apiKey.company.id;
		createDto.group = group;
		const groupIns = await this.unitGroupsService.findById(group);
		if(groupIns===null || !(groupIns.company===null || groupIns.company.id===apiKey.company.id)){
			throw new HttpException('Units group not found', HttpStatus.NOT_FOUND);
		}
		return await this.unitsService.transactional(async (em) => {
			await this.validateCreate(apiKey, group, createDto, em);
			return await this.unitsService.create(createDto, em);
		});
	}
	
	async validateCreate(apiKey: ApiKeys, group: number, createDto: CreateUnitDto, em: EntityManager) { }
	
	async update(apiKey: ApiKeys, group: number, id: number, updateDto: UpdateUnitDto) {
		const groupIns = await this.unitGroupsService.findById(group);
		if(groupIns===null || !(groupIns.company===null || groupIns.company.id===apiKey.company.id)){
			throw new HttpException('Units group not found', HttpStatus.NOT_FOUND);
		}
		return await this.unitsService.transactional(async (em) => {
			const entity = await this.unitsService.findById(id, em);
			if(entity===null || !(entity.company!==null && entity.company.id===apiKey.company.id) || !(entity.group.id===group)){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			this.validateUpdate(entity, apiKey, group, id, updateDto, em);
			return await this.unitsService.update(entity, updateDto, em);
		});
	}
	
	async validateUpdate(entity, apiKey: ApiKeys, group: number, id: number, updateDto: UpdateUnitDto, em: EntityManager) { }
	
	async delete(apiKey: ApiKeys, group: number, id: number) {
		const groupIns = await this.unitGroupsService.findById(group);
		if(groupIns===null || !(groupIns.company===null || groupIns.company.id===apiKey.company.id)){
			throw new HttpException('Units group not found', HttpStatus.NOT_FOUND);
		}
		return await this.unitsService.transactional(async (em) => {
			const entity = await this.unitsService.findById(id, em);
			if(entity===null || !(entity.company!==null && entity.company.id===apiKey.company.id) || !(entity.group.id===group)){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			await this.validateDelete(entity, apiKey, group, id, em);
			return await this.unitsService.remove(entity, em);
		});
	}
	
	async validateDelete(entity, apiKey: ApiKeys, group: number, id: number, em: EntityManager) { }
	
}