import { GenCatalogTypesService } from './gen/catalog-types.service';
import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql'
import { CatalogTypes } from './../../entities/CatalogTypes'

@Injectable()
export class CatalogTypesService extends GenCatalogTypesService {
	
	async findRoot(catalog: number, emt: EntityManager) {
		return await this.getEm(emt).findOne(CatalogTypes, {
			catalog: catalog,
			parent: { $eq: null }
		});
  }

  async findChildren(parent: number, emt: EntityManager) {
		return await this.getEm(emt).find(CatalogTypes, {
			parent: parent
		});
  }

  async hasChildren(parent: number, emt: EntityManager) {
	  const children = await this.getEm(emt).find(CatalogTypes, {
			parent: parent
		}, {
			limit: 1
		});
		return children.length>0;
  }

	
}