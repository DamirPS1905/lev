import { GenProductPricesService } from './gen/product-prices.service'
import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule';
import { ProductPrices } from './../../entities/ProductPrices';
import { EntityManager, wrap } from '@mikro-orm/postgresql';

@Injectable()
export class ProductPricesService extends GenProductPricesService {
	
  @Cron('17 */2 * * *')
	async sanitize(){
		const qu = `DELETE FROM public.product_prices 
								WHERE "changed_at" < CURRENT_TIMESTAMP - INTERVAL '1 week'
									AND "deleted"`;
		await this.getEm().getConnection().execute(qu);
	}
	
	async findActualByPriceTypeAndCatalog(priceType: number, catalog: number, emt: EntityManager = null) {
		return await this.getEm(emt)
			.createQueryBuilder(ProductPrices, 'pp')
		  .select(['pp.*'])
		  .join('pp.product', 'p')
		  .where({'p.catalog': catalog, 'pp.priceType': priceType, 'pp.deleted': false })
		  .getResult();
	}
	
	async listActualByPriceTypeAndCatalog(priceType: number, catalog: number, offset: number, limit: number, emt: EntityManager = null) {
		return await this.getEm(emt)
			.createQueryBuilder(ProductPrices, 'pp')
		  .select(['pp.*'])
		  .join('pp.product', 'p')
		  .where({'p.catalog': catalog, 'pp.priceType': priceType, 'pp.deleted': false })
		  .orderBy({ product: "ASC" })
		  .limit(limit, offset)
		  .getResult();
	}
	
	findActualByProductAndPriceType(product: bigint, priceType: number, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.findOne(ProductPrices, {
			product: product, priceType: priceType, deleted: false
		});
	}
	
	findActualByPriceType(priceType: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(ProductPrices, {
			priceType: priceType, deleted: false
		});
	}
	
	listActualByPriceType(priceType: number, offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(ProductPrices, {
			priceType: priceType, deleted: false
		}, {
			limit: limit,
			offset: offset,
			orderBy: { product: "ASC", priceType: "ASC" },
		});
	}
	
	findActualByProduct(product: bigint, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(ProductPrices, {
			product: product, deleted: false
		});
	}
	
	listActualByProduct(product: bigint, offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(ProductPrices, {
			product: product, deleted: false
		}, {
			limit: limit,
			offset: offset,
			orderBy: { product: "ASC", priceType: "ASC" },
		});
	}
	
	listActual(offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(ProductPrices, {deleted: false}, {
			limit: limit,
			offset: offset,
			orderBy: { product: "ASC", priceType: "ASC" },
		});
	}
	
	findActual(emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(ProductPrices, {deleted: false}, {
			orderBy: { product: "ASC", priceType: "ASC" },
		});
	}
	
}