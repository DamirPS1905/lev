import { AuthInfo } from './../../decorators/auth.decorator'
import { ApiKeys } from './../../entities/ApiKeys'
import { CreateCurrencyDto } from './../dtos/create-currency.dto'
import { UpdateCurrencyDto } from './../dtos/update-currency.dto'
import { CurrenciesService } from './../services/currencies.service'
import { GenCurrenciesController } from './gen/currencies.controller'
import { EntityManager } from '@mikro-orm/postgresql'
import { DefaultValuePipe, Get, Param, ParseIntPipe, Query } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiQuery } from '@nestjs/swagger'

export class CurrenciesController extends GenCurrenciesController {
	
	@Get('all')
	@ApiQuery({name: 'limit', description: 'Maximum count of returning entities', required: false})
	@ApiQuery({ name: 'offset', description: 'Count of skipping entities', required: false})
	async findAll(@AuthInfo() apiKey: ApiKeys, @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number, @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number) {
		return await super.findAll(apiKey, offset, limit);
	}
	
	
}