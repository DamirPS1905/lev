/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/controllers/rates-sources.controller
 * in a proper way.
 */
import { AuthInfo } from './../../../decorators/auth.decorator';
import { ApiKeys } from './../../../entities/ApiKeys';
import { CreateRatesSourceDto } from './../../dtos/create-rates-source.dto';
import { UpdateRatesSourceDto } from './../../dtos/update-rates-source.dto';
import { RatesSourcesService } from './../../services/rates-sources.service';
import { EntityManager } from '@mikro-orm/postgresql';
import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiHeader, ApiTags } from '@nestjs/swagger';

@ApiHeader({ name: 'X-API-KEY', required: true })
@UseGuards(AuthGuard('api-key'))
@ApiTags('Rates sources')
@Controller('rates-source')
export class GenRatesSourcesController {
	constructor(
		protected readonly ratesSourcesService: RatesSourcesService,
	) { }
	
	async findAll(apiKey: ApiKeys) {
		return await this.ratesSourcesService.findAll();
	}
	
}