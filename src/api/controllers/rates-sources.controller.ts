import { AuthInfo } from './../../decorators/auth.decorator'
import { Actors } from './../../entities/Actors'
import { CreateRatesSourceDto } from './../dtos/create-rates-source.dto'
import { UpdateRatesSourceDto } from './../dtos/update-rates-source.dto'
import { RatesSourcesService } from './../services/rates-sources.service'
import { GenRatesSourcesController } from './gen/rates-sources.controller'
import { EntityManager } from '@mikro-orm/postgresql'
import { Get } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiOperation, ApiParam } from '@nestjs/swagger'

export class RatesSourcesController extends GenRatesSourcesController {
	
	@Get('all')
	@ApiOperation({summary: "Получение информации о доступных источников курсов"})
	async findAll(@AuthInfo() actor: Actors) {
		return await super.findAll(actor);
	}
	
	
}