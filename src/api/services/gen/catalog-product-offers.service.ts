/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/services/catalog-product-offers.service
 * in a proper way.
 */
import { CatalogProductOffers } from './../../../entities/CatalogProductOffers';
import { CreateCatalogProductOfferDto } from './../../dtos/create-catalog-product-offer.dto';
import { UpdateCatalogProductOfferDto } from './../../dtos/update-catalog-product-offer.dto';
import { AService } from './../abstract/abstract.service';
import { FilesService } from './../special/files.service';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, wrap } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GenCatalogProductOffersService extends AService{
	
	constructor(
		em: EntityManager,
		fm: FilesService,
	){ super(em, fm); }
	
	async create(createDto: CreateCatalogProductOfferDto, emt: EntityManager = null) {
		const em = this.getEm(emt),
		      instance = em.create(CatalogProductOffers, createDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	async update(instance: CatalogProductOffers, updateDto: UpdateCatalogProductOfferDto, emt: EntityManager = null) {
		const em = this.getEm(emt);
		wrap(instance).assign(updateDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	remove(instance: CatalogProductOffers, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.remove(instance).flush();
	}
	
	findById(id: bigint, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.findOne(CatalogProductOffers, {
			id: id
		});
	}
	
	findByCatalogAndArticle(catalog: number, article: string, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.findOne(CatalogProductOffers, {
			catalog: catalog, article: article
		});
	}
	
	findByProductAndArticle(product: bigint, article: string, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.findOne(CatalogProductOffers, {
			product: product, article: article
		});
	}
	
	findAllByProduct(product: bigint, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(CatalogProductOffers, {
			product: product
		});
	}
	
	listByProduct(product: bigint, offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(CatalogProductOffers, {
			product: product
		}, {
			limit: limit,
			offset: offset,
			orderBy: { id: "ASC" },
		});
	}
	
	findAllByCatalog(catalog: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(CatalogProductOffers, {
			catalog: catalog
		});
	}
	
	listByCatalog(catalog: number, offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(CatalogProductOffers, {
			catalog: catalog
		}, {
			limit: limit,
			offset: offset,
			orderBy: { id: "ASC" },
		});
	}
	
	listAll(offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(CatalogProductOffers, { }, {
			limit: limit,
			offset: offset,
			orderBy: { id: "ASC" },
		});
	}
	
	findAll(emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(CatalogProductOffers, { }, {
			orderBy: { id: "ASC" },
		});
	}
	
	
}