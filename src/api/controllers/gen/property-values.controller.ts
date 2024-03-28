/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/controllers/property-values.controller
 * in a proper way.
 */
import { AuthInfo } from './../../../decorators/auth.decorator'
import { ApiKeys } from './../../../entities/ApiKeys'
import { CreatePropertyValueDto } from './../../dtos/create-property-value.dto'
import { UpdatePropertyValueDto } from './../../dtos/update-property-value.dto'
import { PropertyTypesService } from './../../services/property-types.service'
import { PropertyValuesService } from './../../services/property-values.service'
import { EntityManager } from '@mikro-orm/postgresql'
import { Controller, HttpException, HttpStatus, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiHeader, ApiTags } from '@nestjs/swagger'

@ApiHeader({ name: 'X-API-KEY', required: true })
@UseGuards(AuthGuard('api-key'))
@ApiTags('Property values')
@Controller('catalog/:catalog/property-value')
export class GenPropertyValuesController {
	constructor(
		protected readonly propertyTypesService: PropertyTypesService,
		protected readonly propertyValuesService: PropertyValuesService,
	) { }
	
	async findAll(apiKey: ApiKeys, offset: number, limit: number) {
		if(offset<0) throw new HttpException('Wrong offset value', HttpStatus.BAD_REQUEST);
		if(limit<0) throw new HttpException('Wrong limit value', HttpStatus.BAD_REQUEST);
		if(limit>1000) limit = 1000; // throw new HttpException('Wrong limit value', HttpStatus.BAD_REQUEST);
		return await this.propertyValuesService.listAll(offset, limit);
	}
	
	async findOne(apiKey: ApiKeys, order: number, valueKey: bigint) {
		const entity = await this.propertyValuesService.findByOrderAndValueKey(order, valueKey);
		if(entity===null){
			throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
		}
		await this.validateRead(entity, apiKey, order, valueKey);
		return entity;
	}
	
	async validateRead(entity, apiKey: ApiKeys, order: number, valueKey: bigint) { }
	
	async create(apiKey: ApiKeys, createDto: CreatePropertyValueDto) {
		createDto.order = order;
		createDto.valueKey = valueKey;
		return await this.propertyValuesService.transactional(async (em) => {
			const tmp0 = await this.propertyTypesService.findById(createDto.type, em);
			if(tmp0===null){
				throw new HttpException('Not found contrainst (type)', HttpStatus.CONFLICT);
			}
			await this.validateCreate(apiKey, createDto, em);
			return await this.propertyValuesService.create(createDto, em);
		});
	}
	
	async validateCreate(apiKey: ApiKeys, createDto: CreatePropertyValueDto, em: EntityManager) { }
	
	async update(apiKey: ApiKeys, order: number, valueKey: bigint, updateDto: UpdatePropertyValueDto) {
		return await this.propertyValuesService.transactional(async (em) => {
			const entity = await this.propertyValuesService.findByOrderAndValueKey(order, valueKey, em);
			if((updateDto.type!==undefined && updateDto.type!==entity.type.id)){
				const tmp1 = await this.propertyTypesService.findById(updateDto.type, em);
				if(tmp1===null){
					throw new HttpException('Not found contrainst (type)', HttpStatus.CONFLICT);
				}
			}
			await this.validateUpdate(entity, apiKey, order, valueKey, updateDto, em);
			if(entity===null){
				return await this.propertyValuesService.update(entity, updateDto, em);
			} else {
				return await this.propertyValuesService.create(updateDto, em);
			}
		});
	}
	
	async validateUpdate(entity, apiKey: ApiKeys, order: number, valueKey: bigint, updateDto: UpdatePropertyValueDto, em: EntityManager) { }
	
	async delete(apiKey: ApiKeys, order: number, valueKey: bigint) {
		return await this.propertyValuesService.transactional(async (em) => {
			const entity = await this.propertyValuesService.findByOrderAndValueKey(order, valueKey, em);
			if(entity===null){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			await this.validateDelete(entity, apiKey, order, valueKey, em);
			return await this.propertyValuesService.remove(entity, em);
		});
	}
	
	async validateDelete(entity, apiKey: ApiKeys, order: number, valueKey: bigint, em: EntityManager) { }
	
}