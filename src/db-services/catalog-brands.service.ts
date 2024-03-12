import { GenCatalogBrandsService } from './gen/catalog-brands.service';
import { CatalogBrands } from '../entities/CatalogBrands';
import { Injectable } from '@nestjs/common'

@Injectable()
export class CatalogBrandsService extends GenCatalogBrandsService {
	
  findAll(catalog_id: number, limit: number, offset: number) {
	  return this.em.fork().find(CatalogBrands, {
		  catalog: catalog_id
	  }, {
		  limit: limit,
		  offset: offset,
		  orderBy: { id: 'asc' },
		});
  }
	
 findInCatalogById(catalog: number, id: number) {
		return this.em.fork().findOne(CatalogBrands, {
			id: id,
			catalog: catalog
		});
  }

}