import { CatalogProductOffers } from './../../../entities/CatalogProductOffers'
import { CreateCatalogProductOfferDto } from './../../dtos/create-catalog-product-offer.dto'
import { UpdateCatalogProductOfferDto } from './../../dtos/update-catalog-product-offer.dto'
import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityManager, wrap } from '@mikro-orm/postgresql'
import { Injectable } from '@nestjs/common'

@Injectable()
export class GenCatalogProductOffersService {
	
	constructor(
		protected readonly em: EntityManager,
	){}
	
	async create(createDto: CreateCatalogProductOfferDto, emt: EntityManager = null) {
		const em = emt || this.em.fork(),
		      instance = em.create(CatalogProductOffers, createDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	async update(instance: CatalogProductOffers, updateDto: UpdateCatalogProductOfferDto, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		wrap(instance).assign(updateDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	remove(instance: CatalogProductOffers, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.remove(instance).flush();
	}
	
	async transactional(cb){ return await this.em.fork().transactional(cb); }
	
	
	findByCatalogAndArticle(catalog: number, article: string, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.findOne(CatalogProductOffers, {
			catalog: catalog, article: article
		});
	}
	
	findById(id: bigint, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.findOne(CatalogProductOffers, {
			id: id
		});
	}
	
	findAllByProduct(product: bigint, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(CatalogProductOffers, {
			product: product
		});
	}
	
	findAllByCatalog(catalog: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(CatalogProductOffers, {
			catalog: catalog
		});
	}
	
	
}