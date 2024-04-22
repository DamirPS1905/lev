import { GenOfferPricesService } from './gen/offer-prices.service'
import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule';
import { OfferPrices } from './../../entities/OfferPrices';
import { EntityManager, wrap } from '@mikro-orm/postgresql';

@Injectable()
export class OfferPricesService extends GenOfferPricesService {
	
  @Cron('5 */2 * * *')
	async sanitize(){
		const qu = `DELETE FROM public.offer_prices 
								WHERE "changed_at" < CURRENT_TIMESTAMP - INTERVAL '1 week'
									AND "deleted"`;
		await this.getEm().getConnection().execute(qu);
	}
	
	async findActualByPriceTypeAndCatalog(priceType: number, catalog: number, emt: EntityManager = null) {
		return await this.getEm(emt)
			.createQueryBuilder(OfferPrices, 'op')
		  .select(['op.*'])
		  .join('op.offer', 'p')
		  .where({'p.catalog': catalog, 'op.priceType': priceType, 'op.deleted': false })
		  .getResult();
	}
	
	async findNewByPriceTypeAndCatalog(priceType: number, catalog: number, from: bigint, limit: number, emt: EntityManager = null) {
		return await this.getEm(emt)
			.createQueryBuilder(OfferPrices, 'op')
		  .select(['op.*'])
		  .join('op.offer', 'p')
		  .where({'p.catalog': catalog, 'op.version': {$gt: from}, 'op.priceType': priceType })
		  .orderBy({ 'op.version': "ASC" })
		  .limit(limit)
		  .getResult();
	}
	
	async listActualByPriceTypeAndCatalog(priceType: number, catalog: number, offset: number, limit: number, emt: EntityManager = null) {
		return await this.getEm(emt)
			.createQueryBuilder(OfferPrices, 'op')
		  .select(['op.*'])
		  .join('op.offer', 'p')
		  .where({'p.catalog': catalog, 'op.priceType': priceType, 'op.deleted': false })
		  .orderBy({ offer: "ASC" })
		  .limit(limit, offset)
		  .getResult();
	}
	
	findActualByOfferAndPriceType(offer: bigint, priceType: number, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.findOne(OfferPrices, {
			offer: offer, priceType: priceType, deleted: false
		});
	}
	
	findActualByPriceType(priceType: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(OfferPrices, {
			priceType: priceType, deleted: false
		});
	}
	
	listActualByPriceType(priceType: number, offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(OfferPrices, {
			priceType: priceType, deleted: false
		}, {
			limit: limit,
			offset: offset,
			orderBy: { offer: "ASC", priceType: "ASC" },
		});
	}
	
	findActualByOffer(offer: bigint, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(OfferPrices, {
			offer: offer, deleted: false
		});
	}
	
	listActualByOffer(offer: bigint, offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(OfferPrices, {
			offer: offer, deleted: false
		}, {
			limit: limit,
			offset: offset,
			orderBy: { offer: "ASC", priceType: "ASC" },
		});
	}
	
	listActual(offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(OfferPrices, {deleted: false}, {
			limit: limit,
			offset: offset,
			orderBy: { offer: "ASC", priceType: "ASC" },
		});
	}
	
	findActual(emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(OfferPrices, {deleted: false}, {
			orderBy: { offer: "ASC", priceType: "ASC" },
		});
	}
	
}