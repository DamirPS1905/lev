import { AuthInfo } from './../../decorators/auth.decorator'
import { ApiKeys } from './../../entities/ApiKeys'
import { CreateCurrencyDto } from './../dtos/create-currency.dto'
import { UpdateCurrencyDto } from './../dtos/update-currency.dto'
import { CurrenciesService } from './../services/currencies.service'
import { GenCurrenciesController } from './gen/currencies.controller'
import { EntityManager } from '@mikro-orm/postgresql'
import { Get } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

export class CurrenciesController extends GenCurrenciesController {
	
	@Get('all')
	async findAll(@AuthInfo() apiKey: ApiKeys) {
		return await super.findAll(apiKey);
	}
	
	
}