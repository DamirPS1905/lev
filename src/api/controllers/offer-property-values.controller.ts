import { AuthInfo } from './../../decorators/auth.decorator'
import { ApiKeys } from './../../entities/ApiKeys'
import { CreateOfferPropertyValueDto } from './../dtos/create-offer-property-value.dto'
import { UpdateOfferPropertyValueDto } from './../dtos/update-offer-property-value.dto'
import { OfferPropertyValuesService } from './../services/offer-property-values.service'
import { GenOfferPropertyValuesController } from './gen/offer-property-values.controller'
import { EntityManager } from '@mikro-orm/postgresql'
import { Body, Delete, Get, Param, ParseIntPipe, Patch } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

export class OfferPropertyValuesController extends GenOfferPropertyValuesController {
	
	@Get('property/:property')
	async findOne(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('product') product: bigint, @Param('offer') offer: bigint, @Param('property', ParseIntPipe) property: number) {
		return await super.findOne(apiKey, catalog, product, offer, property);
	}
	
	@Patch('property/:property')
	async update(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('product') product: bigint, @Param('offer') offer: bigint, @Param('property', ParseIntPipe) property: number, @Body() updateDto: UpdateOfferPropertyValueDto) {
		return await super.update(apiKey, catalog, product, offer, property, updateDto);
	}
	
	@Delete('property/:property')
	async delete(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('product') product: bigint, @Param('offer') offer: bigint, @Param('property', ParseIntPipe) property: number) {
		return await super.delete(apiKey, catalog, product, offer, property);
	}
	
	
}