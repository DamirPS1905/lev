import { GenCatalogMetatypePropertiesService } from './gen/catalog-metatype-properties.service'
import { Injectable } from '@nestjs/common'
import { EntityManager } from '@mikro-orm/postgresql'
import { CatalogMetatypeProperties } from './../../entities/CatalogMetatypeProperties'

@Injectable()
export class CatalogMetatypePropertiesService extends GenCatalogMetatypePropertiesService {
	
	findAllByCatalogAndMetatype(catalog: number, metatype: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(CatalogMetatypeProperties, {
			metatype: metatype,
			catalog: catalog
		});
	}
	
}