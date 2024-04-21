/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/controllers/price-types.controller
 * in a proper way.
 */
import { AuthInfo } from './../../../decorators/auth.decorator';
import { Actors } from './../../../entities/Actors';
import { CreatePriceTypeDto } from './../../dtos/create-price-type.dto';
import { UpdatePriceTypeDto } from './../../dtos/update-price-type.dto';
import { CurrenciesService } from './../../services/currencies.service';
import { PriceTypesService } from './../../services/price-types.service';
import { FsPatch } from './../../services/special/files.service';
import { EntityManager } from '@mikro-orm/postgresql';
import { Controller, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiHeader, ApiTags } from '@nestjs/swagger';

@ApiHeader({ name: 'X-API-KEY', required: true, description: 'Ваш идентефикатор апи' })
@UseGuards(AuthGuard('api-key'))
@ApiTags('Price types')
@Controller('price-type')
export class GenPriceTypesController {
	constructor(
		protected readonly currenciesService: CurrenciesService,
		protected readonly priceTypesService: PriceTypesService,
	) { }
	
	async findAll(actor: Actors) {
		return await this.priceTypesService.findAllByCompany(actor.company.id);
	}
	
	async findOne(actor: Actors, id: number) {
		const entity = await this.priceTypesService.findById(id);
		if(entity===null || !(entity.company.id===actor.company.id)){
			throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
		}
		await this.validateRead(entity, actor, id);
		return entity;
	}
	
	async validateRead(entity, actor: Actors, id: number) { }
	
	async create(actor: Actors, createDto: CreatePriceTypeDto) {
		createDto.company = actor.company.id;
		return await this.priceTypesService.transactional(async (em, fm) => {
			const existed0 = await this.priceTypesService.findByCompanyAndTitle(actor.company.id, createDto.title, em);
			if(existed0!==null){
				throw new HttpException('Duplicate (company, title)', HttpStatus.CONFLICT);
			}
			if(createDto.displayCurrency!==null){
				if(createDto.displayCurrency!==undefined){
					const displayCurrencyIns = await this.currenciesService.findById(createDto.displayCurrency);
					if(createDto.displayCurrency!==null){
						if(displayCurrencyIns===null){
							throw new HttpException('Display currency not found', HttpStatus.NOT_FOUND);
						}
					}
				}
			}
			const baseCurrencyIns = await this.currenciesService.findById(createDto.baseCurrency);
			if(baseCurrencyIns===null){
				throw new HttpException('Base currency not found', HttpStatus.NOT_FOUND);
			}
			await this.validateCreate(actor, createDto, em, fm);
			const result = await this.priceTypesService.create(createDto, em);
			await this.afterCreate(result, actor, createDto, em, fm);
			return result;
		});
	}
	
	async validateCreate(actor: Actors, createDto: CreatePriceTypeDto, em: EntityManager, fm: FsPatch) { }
	async afterCreate(entity, actor: Actors, createDto: CreatePriceTypeDto, em: EntityManager, fm: FsPatch) { }
	
	async update(actor: Actors, id: number, updateDto: UpdatePriceTypeDto) {
		return await this.priceTypesService.transactional(async (em, fm) => {
			const entity = await this.priceTypesService.findById(id, em);
			if(updateDto.displayCurrency!==null){
				if(updateDto.displayCurrency!==undefined){
					const displayCurrencyIns = await this.currenciesService.findById(updateDto.displayCurrency);
					if(updateDto.displayCurrency!==null){
						if(displayCurrencyIns===null){
							throw new HttpException('Display currency not found', HttpStatus.NOT_FOUND);
						}
					}
				}
			}
			if(entity===null || !(entity.company.id===actor.company.id)){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			if((updateDto.title!==undefined && updateDto.title!==entity.title)){
				const existed = await this.priceTypesService.findByCompanyAndTitle(entity.company.id, updateDto.title, em);
				if(existed!==null && (entity.id!==existed.id)){
					throw new HttpException('Duplicate (company, title)', HttpStatus.CONFLICT);
				}
			}
			await this.validateUpdate(entity, actor, id, updateDto, em, fm);
			return await this.priceTypesService.update(entity, updateDto, em);
		});
	}
	
	async validateUpdate(entity, actor: Actors, id: number, updateDto: UpdatePriceTypeDto, em: EntityManager, fm: FsPatch) { }
	async afterUpdate(entity, actor: Actors, id: number, updateDto: UpdatePriceTypeDto, em: EntityManager, fm: FsPatch) { }
	
	async delete(actor: Actors, id: number) {
		return await this.priceTypesService.transactional(async (em, fm) => {
			const entity = await this.priceTypesService.findById(id, em);
			if(entity===null || !(entity.company.id===actor.company.id)){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			await this.validateDelete(entity, actor, id, em, fm);
			await this.priceTypesService.remove(entity, em);
			await this.afterDelete(entity, actor, id, em, fm);
		});
	}
	
	async validateDelete(entity, actor: Actors, id: number, em: EntityManager, fm: FsPatch) { }
	async afterDelete(entity, actor: Actors, id: number, em: EntityManager, fm: FsPatch) { }
	
}