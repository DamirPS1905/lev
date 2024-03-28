/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/controllers/rates-history.controller
 * in a proper way.
 */
import { AuthInfo } from './../../../decorators/auth.decorator'
import { ApiKeys } from './../../../entities/ApiKeys'
import { CreateRatesHistoryDto } from './../../dtos/create-rates-history.dto'
import { UpdateRatesHistoryDto } from './../../dtos/update-rates-history.dto'
import { RatesHistoryService } from './../../services/rates-history.service'
import { EntityManager } from '@mikro-orm/postgresql'
import { Controller, HttpException, HttpStatus, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiHeader, ApiTags } from '@nestjs/swagger'

@ApiHeader({ name: 'X-API-KEY', required: true })
@UseGuards(AuthGuard('api-key'))
@ApiTags('Rates history')
@Controller('catalog/:catalog/rates-history')
export class GenRatesHistoryController {
	constructor(
		protected readonly ratesHistoryService: RatesHistoryService,
	) { }
	
	async findAll(apiKey: ApiKeys, offset: number, limit: number) {
		if(offset<0) throw new HttpException('Wrong offset value', HttpStatus.BAD_REQUEST);
		if(limit<0) throw new HttpException('Wrong limit value', HttpStatus.BAD_REQUEST);
		if(limit>1000) limit = 1000; // throw new HttpException('Wrong limit value', HttpStatus.BAD_REQUEST);
		return await this.ratesHistoryService.listAll(offset, limit);
	}
	
	async findOne(apiKey: ApiKeys, from: number, to: number, source: number, date: any) {
		const entity = await this.ratesHistoryService.findByFromAndToAndSourceAndDate(from, to, source, date);
		if(entity===null){
			throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
		}
		await this.validateRead(entity, apiKey, from, to, source, date);
		return entity;
	}
	
	async validateRead(entity, apiKey: ApiKeys, from: number, to: number, source: number, date: any) { }
	
	async create(apiKey: ApiKeys, createDto: CreateRatesHistoryDto) {
		createDto.from = from;
		createDto.to = to;
		createDto.source = source;
		createDto.date = date;
		return await this.ratesHistoryService.transactional(async (em) => {
			await this.validateCreate(apiKey, createDto, em);
			return await this.ratesHistoryService.create(createDto, em);
		});
	}
	
	async validateCreate(apiKey: ApiKeys, createDto: CreateRatesHistoryDto, em: EntityManager) { }
	
	async update(apiKey: ApiKeys, from: number, to: number, source: number, date: any, updateDto: UpdateRatesHistoryDto) {
		return await this.ratesHistoryService.transactional(async (em) => {
			const entity = await this.ratesHistoryService.findByFromAndToAndSourceAndDate(from, to, source, date, em);
			await this.validateUpdate(entity, apiKey, from, to, source, date, updateDto, em);
			if(entity===null){
				return await this.ratesHistoryService.update(entity, updateDto, em);
			} else {
				return await this.ratesHistoryService.create(updateDto, em);
			}
		});
	}
	
	async validateUpdate(entity, apiKey: ApiKeys, from: number, to: number, source: number, date: any, updateDto: UpdateRatesHistoryDto, em: EntityManager) { }
	
	async delete(apiKey: ApiKeys, from: number, to: number, source: number, date: any) {
		return await this.ratesHistoryService.transactional(async (em) => {
			const entity = await this.ratesHistoryService.findByFromAndToAndSourceAndDate(from, to, source, date, em);
			if(entity===null){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			await this.validateDelete(entity, apiKey, from, to, source, date, em);
			return await this.ratesHistoryService.remove(entity, em);
		});
	}
	
	async validateDelete(entity, apiKey: ApiKeys, from: number, to: number, source: number, date: any, em: EntityManager) { }
	
}