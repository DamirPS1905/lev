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
import { CompaniesService } from './../../services/companies.service'
import { UnitGroupsService } from './../../services/unit-groups.service'
import { UnitsService } from './../../services/units.service'
import { EntityManager } from '@mikro-orm/postgresql'
import { Controller, HttpException, HttpStatus, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiHeader, ApiTags } from '@nestjs/swagger'

@ApiHeader({ name: 'X-API-KEY', required: true })
@UseGuards(AuthGuard('api-key'))
@ApiTags('Units')
@Controller('catalog/:catalog/unit')
export class GenUnitsController {
	constructor(
		protected readonly companiesService: CompaniesService,
		protected readonly unitGroupsService: UnitGroupsService,
		protected readonly unitsService: UnitsService,
	) { }
	
	async findAll(apiKey: ApiKeys, offset: number, limit: number) {
		if(offset<0) throw new HttpException('Wrong offset value', HttpStatus.BAD_REQUEST);
		if(limit<0) throw new HttpException('Wrong limit value', HttpStatus.BAD_REQUEST);
		if(limit>1000) limit = 1000; // throw new HttpException('Wrong limit value', HttpStatus.BAD_REQUEST);
		return await this.unitsService.listAll(offset, limit);
	}
	
	async findOne(apiKey: ApiKeys, id: number) {
		const entity = await this.unitsService.findById(id);
		if(entity===null){
			throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
		}
		await this.validateRead(entity, apiKey, id);
		return entity;
	}
	
	async validateRead(entity, apiKey: ApiKeys, id: number) { }
	
	async create(apiKey: ApiKeys, createDto: CreateUnitDto) {
		createDto.company = apiKey.company.id;
		return await this.unitsService.transactional(async (em) => {
			const tmp0 = await this.unitGroupsService.findById(createDto.group, em);
			if(tmp0===null){
				throw new HttpException('Not found contrainst (group)', HttpStatus.CONFLICT);
			}
			const tmp1 = await this.companiesService.findById(createDto.company, em);
			if(tmp1===null){
				throw new HttpException('Not found contrainst (company)', HttpStatus.CONFLICT);
			}
			await this.validateCreate(apiKey, createDto, em);
			return await this.unitsService.create(createDto, em);
		});
	}
	
	async validateCreate(apiKey: ApiKeys, createDto: CreateUnitDto, em: EntityManager) { }
	
	async update(apiKey: ApiKeys, id: number, updateDto: UpdateUnitDto) {
		return await this.unitsService.transactional(async (em) => {
			const entity = await this.unitsService.findById(id, em);
			if((updateDto.group!==undefined && updateDto.group!==entity.group.id)){
				const tmp2 = await this.unitGroupsService.findById(updateDto.group, em);
				if(tmp2===null){
					throw new HttpException('Not found contrainst (group)', HttpStatus.CONFLICT);
				}
			}
			if(entity===null){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			this.validateUpdate(entity, apiKey, id, updateDto, em);
			return await this.unitsService.update(entity, updateDto, em);
		});
	}
	
	async validateUpdate(entity, apiKey: ApiKeys, id: number, updateDto: UpdateUnitDto, em: EntityManager) { }
	
	async delete(apiKey: ApiKeys, id: number) {
		return await this.unitsService.transactional(async (em) => {
			const entity = await this.unitsService.findById(id, em);
			if(entity===null){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			await this.validateDelete(entity, apiKey, id, em);
			return await this.unitsService.remove(entity, em);
		});
	}
	
	async validateDelete(entity, apiKey: ApiKeys, id: number, em: EntityManager) { }
	
}