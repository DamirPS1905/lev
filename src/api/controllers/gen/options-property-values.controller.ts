/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/controllers/options-property-values.controller
 * in a proper way.
 */
import { CreateOptionsPropertyValueDto } from './../../dtos/create-options-property-value.dto';
import { UpdateOptionsPropertyValueDto } from './../../dtos/update-options-property-value.dto';
import { OptionsPropertyValuesService } from './../../services/options-property-values.service';
import { PropertyTypesService } from './../../services/property-types.service';
import { FsPatch } from './../../services/special/files.service';
import { EntityManager } from '@mikro-orm/postgresql';
import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiHeader, ApiTags } from '@nestjs/swagger';

@ApiHeader({ name: 'X-API-KEY', required: true, description: 'Ваш идентефикатор апи' })
@UseGuards(AuthGuard('api-key'))
@ApiTags('Options property values')
@Controller('catalog/:catalog/options-property-value')
export class GenOptionsPropertyValuesController {
	constructor(
		protected readonly optionsPropertyValuesService: OptionsPropertyValuesService,
		protected readonly propertyTypesService: PropertyTypesService,
	) { }
	
}