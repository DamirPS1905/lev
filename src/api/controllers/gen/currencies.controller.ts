/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/controllers/currencies.controller
 * in a proper way.
 */
import { AuthInfo } from './../../../decorators/auth.decorator';
import { Actors } from './../../../entities/Actors';
import { CreateCurrencyDto } from './../../dtos/create-currency.dto';
import { UpdateCurrencyDto } from './../../dtos/update-currency.dto';
import { CurrenciesService } from './../../services/currencies.service';
import { FsPatch } from './../../services/special/files.service';
import { EntityManager } from '@mikro-orm/postgresql';
import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiHeader, ApiTags } from '@nestjs/swagger';

@ApiHeader({ name: 'X-API-KEY', required: true, description: 'Ваш идентефикатор апи' })
@UseGuards(AuthGuard('api-key'))
@ApiTags('Currencies')
@Controller('currency')
export class GenCurrenciesController {
	constructor(
		protected readonly currenciesService: CurrenciesService,
	) { }
	
	async findAll(actor: Actors) {
		return await this.currenciesService.findAll();
	}
	
}