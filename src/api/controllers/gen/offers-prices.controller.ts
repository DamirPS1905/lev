/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/controllers/offers-prices.controller
 * in a proper way.
 */
import { AuthInfo } from './../../../decorators/auth.decorator'
import { ApiKeys } from './../../../entities/ApiKeys'
import { CreateOffersPriceDto } from './../../dtos/create-offers-price.dto'
import { UpdateOffersPriceDto } from './../../dtos/update-offers-price.dto'
import { CatalogProductOffersService } from './../../services/catalog-product-offers.service'
import { OffersPricesService } from './../../services/offers-prices.service'
import { PriceTypesService } from './../../services/price-types.service'
import { EntityManager } from '@mikro-orm/postgresql'
import { Controller, HttpException, HttpStatus, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiHeader, ApiTags } from '@nestjs/swagger'

@ApiHeader({ name: 'X-API-KEY', required: true })
@UseGuards(AuthGuard('api-key'))
@ApiTags('Offers prices')
@Controller('catalog/:catalog/offers-price')
export class GenOffersPricesController {
	constructor(
		protected readonly catalogProductOffersService: CatalogProductOffersService,
		protected readonly offersPricesService: OffersPricesService,
		protected readonly priceTypesService: PriceTypesService,
	) { }
	
	async findAll(apiKey: ApiKeys, offset: number, limit: number) {
		if(offset<0) throw new HttpException('Wrong offset value', HttpStatus.BAD_REQUEST);
		if(limit<0) throw new HttpException('Wrong limit value', HttpStatus.BAD_REQUEST);
		if(limit>1000) limit = 1000; // throw new HttpException('Wrong limit value', HttpStatus.BAD_REQUEST);
		return await this.offersPricesService.listAll(offset, limit);
	}
	
	async findOne(apiKey: ApiKeys, offer: bigint, priceType: number) {
		const entity = await this.offersPricesService.findByOfferAndPriceType(offer, priceType);
		if(entity===null){
			throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
		}
		await this.validateRead(entity, apiKey, offer, priceType);
		return entity;
	}
	
	async validateRead(entity, apiKey: ApiKeys, offer: bigint, priceType: number) { }
	
	async update(apiKey: ApiKeys, offer: bigint, priceType: number, updateDto: UpdateOffersPriceDto) {
		return await this.offersPricesService.transactional(async (em) => {
			const entity = await this.offersPricesService.findByOfferAndPriceType(offer, priceType, em);
			if((updateDto.priceType!==undefined && updateDto.priceType!==entity.priceType.id)){
				const tmp0 = await this.priceTypesService.findById(updateDto.priceType, em);
				if(tmp0===null){
					throw new HttpException('Not found contrainst (priceType)', HttpStatus.CONFLICT);
				}
			}
			if((updateDto.offer!==undefined && updateDto.offer!==entity.offer.id)){
				const tmp1 = await this.catalogProductOffersService.findById(updateDto.offer, em);
				if(tmp1===null){
					throw new HttpException('Not found contrainst (offer)', HttpStatus.CONFLICT);
				}
			}
			await this.validateUpdate(entity, apiKey, offer, priceType, updateDto, em);
			if(entity===null){
				return await this.offersPricesService.update(entity, updateDto, em);
			} else {
				return await this.offersPricesService.create(updateDto, em);
			}
		});
	}
	
	async validateUpdate(entity, apiKey: ApiKeys, offer: bigint, priceType: number, updateDto: UpdateOffersPriceDto, em: EntityManager) { }
	
	async delete(apiKey: ApiKeys, offer: bigint, priceType: number) {
		return await this.offersPricesService.transactional(async (em) => {
			const entity = await this.offersPricesService.findByOfferAndPriceType(offer, priceType, em);
			if(entity===null){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			await this.validateDelete(entity, apiKey, offer, priceType, em);
			return await this.offersPricesService.remove(entity, em);
		});
	}
	
	async validateDelete(entity, apiKey: ApiKeys, offer: bigint, priceType: number, em: EntityManager) { }
	
}