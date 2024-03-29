/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/controllers/price-types.controller
 * in a proper way.
 */
import { AuthInfo } from './../../../decorators/auth.decorator'
import { ApiKeys } from './../../../entities/ApiKeys'
import { CreatePriceTypeDto } from './../../dtos/create-price-type.dto'
import { UpdatePriceTypeDto } from './../../dtos/update-price-type.dto'
import { CurrenciesService } from './../../services/currencies.service'
import { PriceTypesService } from './../../services/price-types.service'
import { EntityManager } from '@mikro-orm/postgresql'
import { Controller, HttpException, HttpStatus, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiHeader, ApiTags } from '@nestjs/swagger'

@ApiHeader({ name: 'X-API-KEY', required: true })
@UseGuards(AuthGuard('api-key'))
@ApiTags('Price types')
@Controller('catalog/:catalog/price-type')
export class GenPriceTypesController {
	constructor(
		protected readonly currenciesService: CurrenciesService,
		protected readonly priceTypesService: PriceTypesService,
	) { }
	
	async findAll(apiKey: ApiKeys, offset: number, limit: number) {
		if(offset<0) throw new HttpException('Wrong offset value', HttpStatus.BAD_REQUEST);
		if(limit<0) throw new HttpException('Wrong limit value', HttpStatus.BAD_REQUEST);
		if(limit>1000) limit = 1000; // throw new HttpException('Wrong limit value', HttpStatus.BAD_REQUEST);
		return await this.priceTypesService.listByCompany(apiKey.company.id, offset, limit);
	}
	
	async findOne(apiKey: ApiKeys, id: number) {
		const entity = await this.priceTypesService.findById(id);
		if(entity===null || entity.company.id!==apiKey.company.id){
			throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
		}
		await this.validateRead(entity, apiKey, id);
		return entity;
	}
	
	async validateRead(entity, apiKey: ApiKeys, id: number) { }
	
	async create(apiKey: ApiKeys, createDto: CreatePriceTypeDto) {
		createDto.company = apiKey.company.id;
		return await this.priceTypesService.transactional(async (em) => {
			const existed0 = await this.priceTypesService.findByCompanyAndTitle(createDto.company, createDto.title, em);
			if(existed0!==null){
				throw new HttpException('Duplicate (company, title)', HttpStatus.CONFLICT);
			}
			const tmp0 = await this.currenciesService.findById(createDto.displayCurrency, em);
			if(tmp0===null){
				throw new HttpException('Not found contrainst (displayCurrency)', HttpStatus.CONFLICT);
			}
			await this.validateCreate(apiKey, createDto, em);
			return await this.priceTypesService.create(createDto, em);
		});
	}
	
	async validateCreate(apiKey: ApiKeys, createDto: CreatePriceTypeDto, em: EntityManager) { }
	
	async update(apiKey: ApiKeys, id: number, updateDto: UpdatePriceTypeDto) {
		return await this.priceTypesService.transactional(async (em) => {
			const entity = await this.priceTypesService.findById(id, em);
			if((updateDto.displayCurrency!==undefined && updateDto.displayCurrency!==entity.displayCurrency.id)){
				const tmp1 = await this.currenciesService.findById(updateDto.displayCurrency, em);
				if(tmp1===null){
					throw new HttpException('Not found contrainst (displayCurrency)', HttpStatus.CONFLICT);
				}
			}
			if(entity===null || entity.company.id!==apiKey.company.id){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			if((updateDto.title!==undefined && updateDto.title!==entity.title)){
				const existed0 = await this.priceTypesService.findByCompanyAndTitle(entity.company.id, updateDto.title, em);
				if(existed0!==null && (entity.id !== existed0.id)){
					throw new HttpException('Duplicate (company, title)', HttpStatus.CONFLICT);
				}
			}
			this.validateUpdate(entity, apiKey, id, updateDto, em);
			return await this.priceTypesService.update(entity, updateDto, em);
		});
	}
	
	async validateUpdate(entity, apiKey: ApiKeys, id: number, updateDto: UpdatePriceTypeDto, em: EntityManager) { }
	
	async delete(apiKey: ApiKeys, id: number) {
		return await this.priceTypesService.transactional(async (em) => {
			const entity = await this.priceTypesService.findById(id, em);
			if(entity===null || entity.company.id!==apiKey.company.id){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			await this.validateDelete(entity, apiKey, id, em);
			return await this.priceTypesService.remove(entity, em);
		});
	}
	
	async validateDelete(entity, apiKey: ApiKeys, id: number, em: EntityManager) { }
	
}