import { GenOfferAmountsService } from './gen/offer-amounts.service'
import { Injectable } from '@nestjs/common'
import { EntityManager, wrap } from '@mikro-orm/postgresql';
import { OfferAmounts } from './../../entities/OfferAmounts';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class OfferAmountsService extends GenOfferAmountsService {
	
  @Cron('48 */3 * * *')
	async sanitize(){
		const qu = `DELETE FROM public.offer_amouts 
								WHERE "changed_at" < CURRENT_TIMESTAMP - INTERVAL '1 week'
									AND "amount" = 0`;
		await this.getEm().getConnection().execute(qu);
	}
	
	readAllByOffer(offer: bigint, emt: EntityManager = null){
		return this.getEm(emt)
			.createQueryBuilder(OfferAmounts, 'oa')
		  .select(['oa.store', 'oa.amount'])
		  .where({'oa.offer': offer})
		  .execute();
	}
	
	readNewByCatalogTOffers(catalog: number, version: bigint, limit: number, emt: EntityManager = null){
		return this.getEm(emt)
			.createQueryBuilder(OfferAmounts, 'oa')
			.join('oa.offer', 'o')
		  .select(['oa.store', 'o.id as offer', 'oa.version', 'oa.amount'])
		  .where({'o.catalog': catalog, 'o.artcle': {$ne: null}, 'oa.version': {$gt: version} })
		  .orderBy({'oa.version': 'ASC'})
		  .limit(limit)
		  .execute();
	}
	
	readNewByCatalogTProducts(catalog: number, version: bigint, limit: number, emt: EntityManager = null){
		return this.getEm(emt)
			.createQueryBuilder(OfferAmounts, 'oa')
			.join('oa.offer', 'o')
			.join('o.product', 'p')
		  .select(['oa.store', 'p.id as product', 'oa.version', 'oa.amount'])
		  .where({'p.catalog': catalog, 'p.offersCount': {$lte: 1}, 'oa.version': {$gt: version} })
		  .orderBy({'oa.version': 'ASC'})
		  .limit(limit)
		  .execute();
	}
	
	readNewByCatalogAndStoreTOffers(catalog: number, store: number, version: bigint, limit: number, emt: EntityManager = null){
		return this.getEm(emt)
			.createQueryBuilder(OfferAmounts, 'oa')
			.join('oa.offer', 'o')
		  .select(['o.id as offer', 'oa.version', 'oa.amount'])
		  .where({'o.catalog': catalog, 'o.artcle': {$ne: null}, 'oa.store': store, 'oa.version': {$gt: version} })
		  .orderBy({'oa.version': 'ASC'})
		  .limit(limit)
		  .execute();
	}
	
	readNewByCatalogAndStoreTProducts(catalog: number, store: number, version: bigint, limit: number, emt: EntityManager = null){
		return this.getEm(emt)
			.createQueryBuilder(OfferAmounts, 'oa')
			.join('oa.offer', 'o')
			.join('o.product', 'p')
		  .select(['p.id as product', 'oa.version', 'oa.amount'])
		  .where({'p.catalog': catalog, 'oa.store': store, 'p.offersCount': {$lte: 1}, 'oa.version': {$gt: version} })
		  .orderBy({'oa.version': 'ASC'})
		  .limit(limit)
		  .execute();
	}
	
}