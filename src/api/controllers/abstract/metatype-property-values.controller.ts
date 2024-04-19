import { PropertyValues } from './../../../entities/PropertyValues'
import { EntityManager, wrap } from '@mikro-orm/postgresql'
import { HttpException, HttpStatus } from '@nestjs/common'
import { IMetatypeVauesService } from './../../services/interface/i-metatype-values.service'
import { CatalogMetatypePropertiesService } from './../../services/catalog-metatype-properties.service'
import { CatalogsService } from './../../services/catalogs.service'
import { OptionsPropertyValuesService } from './../../services/options-property-values.service'
import { PropertyTypesService } from './../../services/property-types.service'
import { AbstractValuesController } from './abstract-values.controller'


export abstract class MetatypeValuesController<S extends IMetatypeVauesService<number>> extends AbstractValuesController<number, S> {
		
	constructor(
		protected readonly metatype:number,
		protected readonly catalogMetatypePropertiesService: CatalogMetatypePropertiesService,
		catalogsService: CatalogsService,
		optionsPropertyValuesService: OptionsPropertyValuesService,
		propertyTypesService: PropertyTypesService,
		valuesService: S,
	) {
		super(
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