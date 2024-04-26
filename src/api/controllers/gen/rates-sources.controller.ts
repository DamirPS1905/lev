/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/controllers/rates-sources.controller
 * in a proper way.
 */
import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { Actors } from './../../../entities/Actors';
import { RatesSourcesService } from './../../services/rates-sources.service';

@ApiHeader({ name: 'X-API-KEY', required: true, description: 'Ваш идентефикатор апи' })
@UseGuards(AuthGuard('api-key'))
@ApiTags('Rates sources')
@Controller('rates-source')
export class GenRatesSourcesController {
  constructor(protected readonly ratesSourcesService: RatesSourcesService) {}

  async findAll(actor: Actors) {
    return await this.ratesSourcesService.findAll();
  }
}
