/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/controllers/rates.controller
 * in a proper way.
 */
import { AuthInfo } from './../../../decorators/auth.decorator'
import { ApiKeys } from './../../../entities/ApiKeys'
import { CreateRateDto } from './../../dtos/create-rate.dto'
import { UpdateRateDto } from './../../dtos/update-rate.dto'
import { CurrenciesService } from './../../services/currencies.service'
import { RatesSourcesService } from './../../services/rates-sources.service'
import { RatesService } from './../../services/rates.service'
import { EntityManager } from '@mikro-orm/postgresql'
import { Controller, HttpException, HttpStatus, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiHeader, ApiTags } from '@nestjs/swagger'

@ApiHeader({ name: 'X-API-KEY', required: true })
@UseGuards(AuthGuard('api-key'))
@ApiTags('Rates')
@Controller('catalog/:catalog/rate')
export class GenRatesController {
	constructor(
		protected readonly currenciesService: CurrenciesService,
		protected readonly ratesService: RatesService,
		protected readonly ratesSourcesService: RatesSourcesService,
	) { }
	
	async findAll(apiKey: ApiKeys, offset: number, limit: number) {
		if(offset<0) throw new HttpException('Wrong offset value', HttpStatus.BAD_REQUEST);
		if(limit<0) throw new HttpException('Wrong limit value', HttpStatus.BAD_REQUEST);
		if(limit>1000) limit = 1000; // throw new HttpException('Wrong limit value', HttpStatus.BAD_REQUEST);
		return await this.ratesService.listAll(offset, limit);
	}
	
	async findOne(apiKey: ApiKeys, from: number, to: number, source: number) {
		const entity = await this.ratesService.findByFromAndToAndSource(from, to, source);
		if(entity===null){
			throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
		}
		await this.validateRead(entity, apiKey, from, to, source);
		return entity;
	}
	
	async validateRead(entity, apiKey: ApiKeys, from: number, to: number, source: number) { }
	
	async create(apiKey: ApiKeys, createDto: CreateRateDto) {
		createDto.from = from;
		createDto.to = to;
		createDto.source = source;
		return await this.ratesService.transactional(async (em) => {
			const tmp0 = await this.ratesSourcesService.findById(createDto.source, em);
			if(tmp0===null){
				throw new HttpException('Not found contrainst (source)', HttpStatus.CONFLICT);
			}
			const tmp1 = await this.currenciesService.findById(createDto.to, em);
			if(tmp1===null){
				throw new HttpException('Not found contrainst (to)', HttpStatus.CONFLICT);
			}
			const tmp2 = await this.currenciesService.findById(createDto.from, em);
			if(tmp2===null){
				throw new HttpException('Not found contrainst (from)', HttpStatus.CONFLICT);
			}
			await this.validateCreate(apiKey, createDto, em);
			return await this.ratesService.create(createDto, em);
		});
	}
	
	async validateCreate(apiKey: ApiKeys, createDto: CreateRateDto, em: EntityManager) { }
	
	async update(apiKey: ApiKeys, from: number, to: number, source: number, updateDto: UpdateRateDto) {
		return await this.ratesService.transactional(async (em) => {
			const entity = await this.ratesService.findByFromAndToAndSource(from, to, source, em);
			if((updateDto.source!==undefined && updateDto.source!==entity.source.id)){
				const tmp3 = await this.ratesSourcesService.findById(updateDto.source, em);
				if(tmp3===null){
					throw new HttpException('Not found contrainst (source)', HttpStatus.CONFLICT);
				}
			}
			if((updateDto.to!==undefined && updateDto.to!==entity.to.id)){
				const tmp4 = await this.currenciesService.findById(updateDto.to, em);
				if(tmp4===null){
					throw new HttpException('Not found contrainst (to)', HttpStatus.CONFLICT);
				}
			}
			if((updateDto.from!==undefined && updateDto.from!==entity.from.id)){
				const tmp5 = await this.currenciesService.findById(updateDto.from, em);
				if(tmp5===null){
					throw new HttpException('Not found contrainst (from)', HttpStatus.CONFLICT);
				}
			}
			await this.validateUpdate(entity, apiKey, from, to, source, updateDto, em);
			if(entity===null){
				return await this.ratesService.update(entity, updateDto, em);
			} else {
				return await this.ratesService.create(updateDto, em);
			}
		});
	}
	
	async validateUpdate(entity, apiKey: ApiKeys, from: number, to: number, source: number, updateDto: UpdateRateDto, em: EntityManager) { }
	
	async delete(apiKey: ApiKeys, from: number, to: number, source: number) {
		return await this.ratesService.transactional(async (em) => {
			const entity = await this.ratesService.findByFromAndToAndSource(from, to, source, em);
			if(entity===null){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			await this.validateDelete(entity, apiKey, from, to, source, em);
			return await this.ratesService.remove(entity, em);
		});
	}
	
	async validateDelete(entity, apiKey: ApiKeys, from: number, to: number, source: number, em: EntityManager) { }
	
}