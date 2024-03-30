import { AuthInfo } from './../../decorators/auth.decorator'
import { ApiKeys } from './../../entities/ApiKeys'
import { CreateRatesHistoryDto } from './../dtos/create-rates-history.dto'
import { UpdateRatesHistoryDto } from './../dtos/update-rates-history.dto'
import { RatesHistoryService } from './../services/rates-history.service'
import { GenRatesHistoryController } from './gen/rates-history.controller'
import { EntityManager } from '@mikro-orm/postgresql'
import { DefaultValuePipe, Get, Param, ParseIntPipe, Query } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

export class RatesHistoryController extends GenRatesHistoryController {
	
	@Get('all')
	async findAll(@AuthInfo() apiKey: ApiKeys, @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number, @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number) {
		return await super.findAll(apiKey, offset, limit);
	}
	
	@Get(':from-:to-:source-:date')
	async findOne(@AuthInfo() apiKey: ApiKeys, @Param('from', ParseIntPipe) from: number, @Param('to', ParseIntPipe) to: number, @Param('source', ParseIntPipe) source: number, @Param('date') date: string) {
		return await super.findOne(apiKey, from, to, source, date);
	}
	
	
}