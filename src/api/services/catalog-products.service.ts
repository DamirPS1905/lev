import { CatalogProducts } from './../../entities/CatalogProducts';
import { jrefill, refill } from './../../util/utils';
import { GenCatalogProductsService } from './gen/catalog-products.service';
import { PropertyInTypesService } from './property-in-types.service';
import { FilesService } from './special/files.service';
import { EntityManager, wrap } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CatalogProductsService extends GenCatalogProductsService {
	
	constructor(
		em: EntityManager,
		fm: FilesService,
		protected readonly propertyInTypesService: PropertyInTypesService
	){ super(em, fm); }
	
	async fullModel(product: CatalogProducts, emt: EntityManager = null){
		const em = this.getEm(emt);
		let model = wrap(product).toObject();
		/*const properties = await this.propertyInTypesService.findEveryByType(product.type.id, em),
					values = ;*/
		
		return model;
	}
	
}