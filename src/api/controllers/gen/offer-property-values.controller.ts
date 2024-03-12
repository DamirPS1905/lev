import { AuthInfo } from './../../../decorators/auth.decorator'
import { ApiKeys } from './../../../entities/ApiKeys'
import { CreateOfferPropertyValueDto } from './../../dtos/create-offer-property-value.dto'
import { UpdateOfferPropertyValueDto } from './../../dtos/update-offer-property-value.dto'
import { CatalogProductOffersService } from './../../services/catalog-product-offers.service'
import { CatalogPropertiesService } from './../../services/catalog-properties.service'
import { OfferPropertyValuesService } from './../../services/offer-property-values.service'
import { EntityManager } from '@mikro-orm/postgresql'
import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiExcludeEndpoint, ApiHeader, ApiTags } from '@nestjs/swagger'

@ApiHeader({ name: 'X-API-KEY', required: true })
@UseGuards(AuthGuard('api-key'))
@ApiTags('Offer property values')
@Controller('catalog/:catalog/offer-property-value')
export class GenOfferPropertyValuesController {
	constructor(
		protected readonly catalogProductOffersService: CatalogProductOffersService,
		protected readonly catalogPropertiesService: CatalogPropertiesService,
		protected readonly offerPropertyValuesService: OfferPropertyValuesService,
	) { }
	
	@Get(':offer-:property')
	async findOne(@AuthInfo() apiKey: ApiKeys, @Param('offer') offer: bigint, @Param('property', ParseIntPipe) property: number) {
		const entity = await this.offerPropertyValuesService.findByOfferAndProperty(offer, property);
		if(entity===null){
			throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
		}
		this.validateRead(entity, apiKey, offer, property);
		return entity;
	}
	
	@ApiExcludeEndpoint() validateRead(entity, apiKey: ApiKeys, offer: bigint, property: number) { }
	
	@Post()
	async create(@AuthInfo() apiKey: ApiKeys, @Body() createDto: CreateOfferPropertyValueDto) {
		return await this.offerPropertyValuesService.transactional(async (em) => {
			const tmp0 = await this.catalogPropertiesService.findById(createDto.property, em);
			if(tmp0===null){
				throw new HttpException('Not found contrainst (property)', HttpStatus.CONFLICT);
			}
			const tmp1 = await this.catalogProductOffersService.findById(createDto.offer, em);
			if(tmp1===null){
				throw new HttpException('Not found contrainst (offer)', HttpStatus.CONFLICT);
			}
			this.validateCreate(apiKey, createDto, em);
			return await this.offerPropertyValuesService.create(createDto, em);
		});
	}
	
	@ApiExcludeEndpoint() validateCreate(apiKey: ApiKeys, createDto: CreateOfferPropertyValueDto, em: EntityManager) { }
	
	@Patch(':offer-:property')
	async update(@AuthInfo() apiKey: ApiKeys, @Param('offer') offer: bigint, @Param('property', ParseIntPipe) property: number, @Body() updateDto: UpdateOfferPropertyValueDto) {
		return await this.offerPropertyValuesService.transactional(async (em) => {
			const entity = await this.offerPropertyValuesService.findByOfferAndProperty(offer, property, em);
			if((updateDto.property!==undefined && updateDto.property!==entity.property.id)){
				const tmp2 = await this.catalogPropertiesService.findById(updateDto.property, em);
				if(tmp2===null){
					throw new HttpException('Not found contrainst (property)', HttpStatus.CONFLICT);
				}
			}
			if((updateDto.offer!==undefined && updateDto.offer!==entity.offer.id)){
				const tmp3 = await this.catalogProductOffersService.findById(updateDto.offer, em);
				if(tmp3===null){
					throw new HttpException('Not found contrainst (offer)', HttpStatus.CONFLICT);
				}
			}
			this.validateUpdate(entity, apiKey, offer, property, updateDto, em);
			return await this.offerPropertyValuesService.update(entity, updateDto, em);
		});
	}
	
	@ApiExcludeEndpoint() validateUpdate(entity, apiKey: ApiKeys, offer: bigint, property: number, updateDto: UpdateOfferPropertyValueDto, em: EntityManager) { }
	
	@Delete(':offer-:property')
	async delete(@AuthInfo() apiKey: ApiKeys, @Param('offer') offer: bigint, @Param('property', ParseIntPipe) property: number) {
		return await this.offerPropertyValuesService.transactional(async (em) => {
			const entity = await this.offerPropertyValuesService.findByOfferAndProperty(offer, property, em);
			if(entity===null){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			this.validateDelete(entity, apiKey, offer, property, em);
			return await this.offerPropertyValuesService.remove(entity, em);
		});
	}
	
	@ApiExcludeEndpoint() validateDelete(entity, apiKey: ApiKeys, offer: bigint, property: number, em: EntityManager) { }
	
}