import { GenCatalogProductOffersService } from './gen/catalog-product-offers.service';
import { Injectable } from '@nestjs/common';
import { CatalogProductOffers } from './../../entities/CatalogProductOffers';
import { EntityManager, wrap } from '@mikro-orm/postgresql';

@Injectable()
export class CatalogProductOffersService extends GenCatalogProductOffersService {
	
	findNullOfferByProduct(product: bigint, emt: EntityManager = null) {
		return this.getEm(emt).findOne(CatalogProductOffers, {
			product: product,
			article: {$eq: null}
		});
	}
	
	findOneByProduct(product: bigint, emt: EntityManager = null) {
		return this.getEm(emt).findOne(CatalogProductOffers, {
			product: product
		});
	}
	
	findAllNotNullByProduct(product: bigint, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(CatalogProductOffers, {
			product: product,
			article: {$ne: null}
		});
	}
	
}