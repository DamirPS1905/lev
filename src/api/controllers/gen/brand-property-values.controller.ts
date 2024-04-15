/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/controllers/brand-property-values.controller
 * in a proper way.
 */
import { CreateBrandPropertyValueDto } from './../../dtos/create-brand-property-value.dto';
import { UpdateBrandPropertyValueDto } from './../../dtos/update-brand-property-value.dto';
import { BrandPropertyValuesService } from './../../services/brand-property-values.service';
import { EntityManager } from '@mikro-orm/postgresql';
import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiHeader, ApiTags } from '@nestjs/swagger';

@ApiHeader({ name: 'X-API-KEY', required: true, description: 'Ваш идентефикатор апи' })
@UseGuards(AuthGuard('api-key'))
@ApiTags('Brand property values')
@Controller('brand-property-value')
export class GenBrandPropertyValuesController {
	constructor(
		protected readonly brandPropertyValuesService: BrandPropertyValuesService,
	) { }
	
}