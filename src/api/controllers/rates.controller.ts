import { AuthInfo } from './../../decorators/auth.decorator'
import { ApiKeys } from './../../entities/ApiKeys'
import { CreateRateDto } from './../dtos/create-rate.dto'
import { UpdateRateDto } from './../dtos/update-rate.dto'
import { RatesService } from './../services/rates.service'
import { GenRatesController } from './gen/rates.controller'
import { EntityManager } from '@mikro-orm/postgresql'
import { DefaultValuePipe, Get, Param, ParseIntPipe, Query } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

export class RatesController extends GenRatesController {
	
	@Get('all')
	async findAll(@AuthInfo() apiKey: ApiKeys, @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number, @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number) {
		return await super.findAll(apiKey, offset, limit);
	}
	
	@Get(':from-:to-:source')
	async findOne(@AuthInfo() apiKey: ApiKeys, @Param('from', ParseIntPipe) from: number, @Param('to', ParseIntPipe) to: number, @Param('source', ParseIntPipe) source: number) {
		return await super.findOne(apiKey, from, to, source);
	}
	
	
}