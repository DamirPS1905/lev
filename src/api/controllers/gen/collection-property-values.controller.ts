/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/controllers/collection-property-values.controller
 * in a proper way.
 */
import { CreateCollectionPropertyValueDto } from './../../dtos/create-collection-property-value.dto';
import { UpdateCollectionPropertyValueDto } from './../../dtos/update-collection-property-value.dto';
import { CollectionPropertyValuesService } from './../../services/collection-property-values.service';
import { EntityManager } from '@mikro-orm/postgresql';
import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiHeader, ApiTags } from '@nestjs/swagger';

@ApiHeader({ name: 'X-API-KEY', required: true })
@UseGuards(AuthGuard('api-key'))
@ApiTags('Collection property values')
@Controller('collection-property-value')
export class GenCollectionPropertyValuesController {
	constructor(
		protected readonly collectionPropertyValuesService: CollectionPropertyValuesService,
	) { }
	
}