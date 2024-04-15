import { AuthInfo } from './../../decorators/auth.decorator'
import { Actors } from './../../entities/Actors'
import { CreateRatesHistoryDto } from './../dtos/create-rates-history.dto'
import { UpdateRatesHistoryDto } from './../dtos/update-rates-history.dto'
import { RatesHistoryService } from './../services/rates-history.service'
import { GenRatesHistoryController } from './gen/rates-history.controller'
import { EntityManager } from '@mikro-orm/postgresql'
import { DefaultValuePipe, Get, Param, ParseIntPipe, Query } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

export class RatesHistoryController extends GenRatesHistoryController {
	
	@Get('all')
	async findAll(@AuthInfo() actor: Actors, @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number, @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number) {
		return await super.findAll(actor, offset, limit);
	}
	
	@Get(':from-:to-:source-:date')
	async findOne(@AuthInfo() actor: Actors, @Param('from', ParseIntPipe) from: number, @Param('to', ParseIntPipe) to: number, @Param('source', ParseIntPipe) source: number, @Param('date') date: string) {
		return await super.findOne(actor, from, to, source, date);
	}
	
	
}