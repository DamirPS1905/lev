/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/controllers/type-property-values.controller
 * in a proper way.
 */
import { CreateTypePropertyValueDto } from './../../dtos/create-type-property-value.dto';
import { UpdateTypePropertyValueDto } from './../../dtos/update-type-property-value.dto';
import { CatalogMetatypePropertiesService } from './../../services/catalog-metatype-properties.service';
import { CatalogPropertiesService } from './../../services/catalog-properties.service';
import { CatalogTypesService } from './../../services/catalog-types.service';
import { CatalogsService } from './../../services/catalogs.service';
import { OptionsPropertyValuesService } from './../../services/options-property-values.service';
import { PropertyTypesService } from './../../services/property-types.service';
import { PropertyValuesService } from './../../services/property-values.service';
import { TypePropertyValuesService } from './../../services/type-property-values.service';
import { EntityManager } from '@mikro-orm/postgresql';
import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiHeader, ApiTags } from '@nestjs/swagger';

@ApiHeader({ name: 'X-API-KEY', required: true })
@UseGuards(AuthGuard('api-key'))
@ApiTags('Type property values')
@Controller('catalog/:catalog/type/:type')
export class GenTypePropertyValuesController {
	constructor(
		protected readonly catalogMetatypePropertiesService: CatalogMetatypePropertiesService,
		protected readonly catalogPropertiesService: CatalogPropertiesService,
		protected readonly catalogTypesService: CatalogTypesService,
		protected readonly catalogsService: CatalogsService,
		protected readonly optionsPropertyValuesService: OptionsPropertyValuesService,
		protected readonly propertyTypesService: PropertyTypesService,
		protected readonly propertyValuesService: PropertyValuesService,
		protected readonly typePropertyValuesService: TypePropertyValuesService,
	) { }
	
}