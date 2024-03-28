/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/controllers/offer-amounts.controller
 * in a proper way.
 */
import { AuthInfo } from './../../../decorators/auth.decorator'
import { ApiKeys } from './../../../entities/ApiKeys'
import { CreateOfferAmountDto } from './../../dtos/create-offer-amount.dto'
import { UpdateOfferAmountDto } from './../../dtos/update-offer-amount.dto'
import { CatalogProductOffersService } from './../../services/catalog-product-offers.service'
import { OfferAmountsService } from './../../services/offer-amounts.service'
import { StoresService } from './../../services/stores.service'
import { EntityManager } from '@mikro-orm/postgresql'
import { Controller, HttpException, HttpStatus, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiHeader, ApiTags } from '@nestjs/swagger'

@ApiHeader({ name: 'X-API-KEY', required: true })
@UseGuards(AuthGuard('api-key'))
@ApiTags('Offer amounts')
@Controller('catalog/:catalog/offer-amount')
export class GenOfferAmountsController {
	constructor(
		protected readonly catalogProductOffersService: CatalogProductOffersService,
		protected readonly offerAmountsService: OfferAmountsService,
		protected readonly storesService: StoresService,
	) { }
	
	async findAll(apiKey: ApiKeys, offset: number, limit: number) {
		if(offset<0) throw new HttpException('Wrong offset value', HttpStatus.BAD_REQUEST);
		if(limit<0) throw new HttpException('Wrong limit value', HttpStatus.BAD_REQUEST);
		if(limit>1000) limit = 1000; // throw new HttpException('Wrong limit value', HttpStatus.BAD_REQUEST);
		return await this.offerAmountsService.listAll(offset, limit);
	}
	
	async findOne(apiKey: ApiKeys, offer: bigint, store: number) {
		const entity = await this.offerAmountsService.findByOfferAndStore(offer, store);
		if(entity===null){
			throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
		}
		await this.validateRead(entity, apiKey, offer, store);
		return entity;
	}
	
	async validateRead(entity, apiKey: ApiKeys, offer: bigint, store: number) { }
	
	async update(apiKey: ApiKeys, offer: bigint, store: number, updateDto: UpdateOfferAmountDto) {
		return await this.offerAmountsService.transactional(async (em) => {
			const entity = await this.offerAmountsService.findByOfferAndStore(offer, store, em);
			if((updateDto.store!==undefined && updateDto.store!==entity.store.id)){
				const tmp0 = await this.storesService.findById(updateDto.store, em);
				if(tmp0===null){
					throw new HttpException('Not found contrainst (store)', HttpStatus.CONFLICT);
				}
			}
			if((updateDto.offer!==undefined && updateDto.offer!==entity.offer.id)){
				const tmp1 = await this.catalogProductOffersService.findById(updateDto.offer, em);
				if(tmp1===null){
					throw new HttpException('Not found contrainst (offer)', HttpStatus.CONFLICT);
				}
			}
			await this.validateUpdate(entity, apiKey, offer, store, updateDto, em);
			if(entity===null){
				return await this.offerAmountsService.update(entity, updateDto, em);
			} else {
				return await this.offerAmountsService.create(updateDto, em);
			}
		});
	}
	
	async validateUpdate(entity, apiKey: ApiKeys, offer: bigint, store: number, updateDto: UpdateOfferAmountDto, em: EntityManager) { }
	
	async delete(apiKey: ApiKeys, offer: bigint, store: number) {
		return await this.offerAmountsService.transactional(async (em) => {
			const entity = await this.offerAmountsService.findByOfferAndStore(offer, store, em);
			if(entity===null){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			await this.validateDelete(entity, apiKey, offer, store, em);
			return await this.offerAmountsService.remove(entity, em);
		});
	}
	
	async validateDelete(entity, apiKey: ApiKeys, offer: bigint, store: number, em: EntityManager) { }
	
}