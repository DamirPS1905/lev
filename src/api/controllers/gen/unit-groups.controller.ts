/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/controllers/unit-groups.controller
 * in a proper way.
 */
import { AuthInfo } from './../../../decorators/auth.decorator'
import { ApiKeys } from './../../../entities/ApiKeys'
import { CreateUnitGroupDto } from './../../dtos/create-unit-group.dto'
import { UpdateUnitGroupDto } from './../../dtos/update-unit-group.dto'
import { CompaniesService } from './../../services/companies.service'
import { UnitGroupsService } from './../../services/unit-groups.service'
import { UnitsService } from './../../services/units.service'
import { EntityManager } from '@mikro-orm/postgresql'
import { Controller, HttpException, HttpStatus, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiHeader, ApiTags } from '@nestjs/swagger'

@ApiHeader({ name: 'X-API-KEY', required: true })
@UseGuards(AuthGuard('api-key'))
@ApiTags('Unit groups')
@Controller('catalog/:catalog/unit-group')
export class GenUnitGroupsController {
	constructor(
		protected readonly companiesService: CompaniesService,
		protected readonly unitGroupsService: UnitGroupsService,
		protected readonly unitsService: UnitsService,
	) { }
	
	async findAll(apiKey: ApiKeys, offset: number, limit: number) {
		if(offset<0) throw new HttpException('Wrong offset value', HttpStatus.BAD_REQUEST);
		if(limit<0) throw new HttpException('Wrong limit value', HttpStatus.BAD_REQUEST);
		if(limit>1000) limit = 1000; // throw new HttpException('Wrong limit value', HttpStatus.BAD_REQUEST);
		return await this.unitGroupsService.listAll(offset, limit);
	}
	
	async findOne(apiKey: ApiKeys, id: number) {
		const entity = await this.unitGroupsService.findById(id);
		if(entity===null){
			throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
		}
		await this.validateRead(entity, apiKey, id);
		return entity;
	}
	
	async validateRead(entity, apiKey: ApiKeys, id: number) { }
	
	async create(apiKey: ApiKeys, createDto: CreateUnitGroupDto) {
		createDto.company = apiKey.company.id;
		return await this.unitGroupsService.transactional(async (em) => {
			const tmp0 = await this.companiesService.findById(createDto.company, em);
			if(tmp0===null){
				throw new HttpException('Not found contrainst (company)', HttpStatus.CONFLICT);
			}
			const tmp1 = await this.unitsService.findById(createDto.base, em);
			if(tmp1===null){
				throw new HttpException('Not found contrainst (base)', HttpStatus.CONFLICT);
			}
			await this.validateCreate(apiKey, createDto, em);
			return await this.unitGroupsService.create(createDto, em);
		});
	}
	
	async validateCreate(apiKey: ApiKeys, createDto: CreateUnitGroupDto, em: EntityManager) { }
	
	async update(apiKey: ApiKeys, id: number, updateDto: UpdateUnitGroupDto) {
		return await this.unitGroupsService.transactional(async (em) => {
			const entity = await this.unitGroupsService.findById(id, em);
			if((updateDto.base!==undefined && updateDto.base!==entity.base.id)){
				const tmp2 = await this.unitsService.findById(updateDto.base, em);
				if(tmp2===null){
					throw new HttpException('Not found contrainst (base)', HttpStatus.CONFLICT);
				}
			}
			if(entity===null){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			this.validateUpdate(entity, apiKey, id, updateDto, em);
			return await this.unitGroupsService.update(entity, updateDto, em);
		});
	}
	
	async validateUpdate(entity, apiKey: ApiKeys, id: number, updateDto: UpdateUnitGroupDto, em: EntityManager) { }
	
	async delete(apiKey: ApiKeys, id: number) {
		return await this.unitGroupsService.transactional(async (em) => {
			const entity = await this.unitGroupsService.findById(id, em);
			if(entity===null){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			await this.validateDelete(entity, apiKey, id, em);
			return await this.unitGroupsService.remove(entity, em);
		});
	}
	
	async validateDelete(entity, apiKey: ApiKeys, id: number, em: EntityManager) { }
	
}