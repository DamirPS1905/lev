/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/controllers/currencies.controller
 * in a proper way.
 */
import { AuthInfo } from './../../../decorators/auth.decorator';
import { ApiKeys } from './../../../entities/ApiKeys';
import { CreateCurrencyDto } from './../../dtos/create-currency.dto';
import { UpdateCurrencyDto } from './../../dtos/update-currency.dto';
import { CurrenciesService } from './../../services/currencies.service';
import { EntityManager } from '@mikro-orm/postgresql';
import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiHeader, ApiTags } from '@nestjs/swagger';

@ApiHeader({ name: 'X-API-KEY', required: true })
@UseGuards(AuthGuard('api-key'))
@ApiTags('Currencies')
@Controller('currency')
export class GenCurrenciesController {
	constructor(
		protected readonly currenciesService: CurrenciesService,
	) { }
	
	async findAll(apiKey: ApiKeys) {
		return await this.currenciesService.findAll();
	}
	
}