import { AuthInfo } from './../../decorators/auth.decorator'
import { ApiKeys } from './../../entities/ApiKeys'
import { CreateRatesSourceDto } from './../dtos/create-rates-source.dto'
import { UpdateRatesSourceDto } from './../dtos/update-rates-source.dto'
import { RatesSourcesService } from './../services/rates-sources.service'
import { GenRatesSourcesController } from './gen/rates-sources.controller'
import { EntityManager } from '@mikro-orm/postgresql'
import { DefaultValuePipe, Get, ParseIntPipe, Query } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiQuery } from '@nestjs/swagger'

export class RatesSourcesController extends GenRatesSourcesController {
	
	@Get('all')
	@ApiQuery({name: 'limit', description: 'Maximum count of returning entities', required: false})
	@ApiQuery({ name: 'offset', description: 'Count of skipping entities', required: false})
	async findAll(@AuthInfo() apiKey: ApiKeys, @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number, @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number) {
		return await super.findAll(apiKey, offset, limit);
	}
	
	
}