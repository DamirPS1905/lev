import { AuthInfo } from './../../decorators/auth.decorator'
import { ApiKeys } from './../../entities/ApiKeys'
import { CreateRatesSourceDto } from './../dtos/create-rates-source.dto'
import { UpdateRatesSourceDto } from './../dtos/update-rates-source.dto'
import { RatesSourcesService } from './../services/rates-sources.service'
import { GenRatesSourcesController } from './gen/rates-sources.controller'
import { EntityManager } from '@mikro-orm/postgresql'
import { Get } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

export class RatesSourcesController extends GenRatesSourcesController {
	
	@Get('all')
	async findAll(@AuthInfo() apiKey: ApiKeys) {
		return await super.findAll(apiKey);
	}
	
	
}