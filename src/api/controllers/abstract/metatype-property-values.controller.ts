import { AuthInfo } from './../../../decorators/auth.decorator'
import { ApiKeys } from './../../../entities/ApiKeys'
import { PropertyValues } from './../../../entities/PropertyValues'
import { EntityManager, wrap } from '@mikro-orm/postgresql'
import { Body, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBody, ApiExtraModels, ApiHeader } from '@nestjs/swagger'
import { IMetatypeVauesService } from './../../services/interface/i-metatype-values.service'
import { CatalogMetatypePropertiesService } from './../../services/catalog-metatype-properties.service'
import { CatalogsService } from './../../services/catalogs.service'
import { OptionsPropertyValuesService } from './../../services/options-property-values.service'
import { PropertyTypesService } from './../../services/property-types.service'
import { AbstractValuesController } from './abstract-values.controller'


@ApiHeader({ name: 'X-API-KEY', required: true })
@UseGuards(AuthGuard('api-key'))
export abstract class MetatypeValuesController<S extends IMetatypeVauesService<number>> extends AbstractValuesController<number, S> {
		
	constructor(
		protected readonly metatype:number,
		entityName:string,
		protected readonly catalogMetatypePropertiesService: CatalogMetatypePropertiesService,
		catalogsService: CatalogsService,
		optionsPropertyValuesService: OptionsPropertyValuesService,
		propertyTypesService: PropertyTypesService,
		valuesService: S,
	) {
		super(
			entityName,
			catalogsService,
			optionsPropertyValuesService,
			propertyTypesService,
			valuesService,
		);
	}
			
	protected async validateAttachment(catalog: number, property: number, instance: number, em: EntityManager = null){
		const metaProperty = await this.catalogMetatypePropertiesService.findByCatalogAndPropertyAndMetatype(catalog, property, this.metatype, em);
		if(metaProperty===null){
			throw new HttpException('Property not found', HttpStatus.NOT_FOUND);			
		}
		await wrap(metaProperty.property).init();
		return [metaProperty.property, metaProperty.scheme];
	}
	
	
}