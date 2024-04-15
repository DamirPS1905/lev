/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/controllers/rates.controller
 * in a proper way.
 */
import { CreateRateDto } from './../../dtos/create-rate.dto';
import { UpdateRateDto } from './../../dtos/update-rate.dto';
import { CurrenciesService } from './../../services/currencies.service';
import { RatesSourcesService } from './../../services/rates-sources.service';
import { RatesService } from './../../services/rates.service';
import { EntityManager } from '@mikro-orm/postgresql';
import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiHeader, ApiTags } from '@nestjs/swagger';

@ApiHeader({ name: 'X-API-KEY', required: true, description: 'Ваш идентефикатор апи' })
@UseGuards(AuthGuard('api-key'))
@ApiTags('Rates')
@Controller('rate')
export class GenRatesController {
	constructor(
		protected readonly currenciesService: CurrenciesService,
		protected readonly ratesService: RatesService,
		protected readonly ratesSourcesService: RatesSourcesService,
	) { }
	
}