/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/services/catalog-brand-collections.service
 * in a proper way.
 */
import { CatalogBrandCollections } from './../../../entities/CatalogBrandCollections';
import { CreateCatalogBrandCollectionDto } from './../../dtos/create-catalog-brand-collection.dto';
import { UpdateCatalogBrandCollectionDto } from './../../dtos/update-catalog-brand-collection.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, wrap } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GenCatalogBrandCollectionsService {
	
	constructor(
		protected readonly em: EntityManager,
	){}
	
	getEm(emt: EntityManager = null) {
		return emt || this.em.fork();
	}
	
	async create(createDto: CreateCatalogBrandCollectionDto, emt: EntityManager = null) {
		const em = this.getEm(emt),
		      instance = em.create(CatalogBrandCollections, createDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	async update(instance: CatalogBrandCollections, updateDto: UpdateCatalogBrandCollectionDto, emt: EntityManager = null) {
		const em = this.getEm(emt);
		wrap(instance).assign(updateDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	remove(instance: CatalogBrandCollections, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.remove(instance).flush();
	}
	
	async transactional(cb){ return await this.em.fork().transactional(cb); }
	
	
	findByBrandAndTitle(brand: number, title: string, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.findOne(CatalogBrandCollections, {
			brand: brand, title: title
		});
	}
	
	findById(id: number, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.findOne(CatalogBrandCollections, {
			id: id
		});
	}
	
	findAllByBrand(brand: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(CatalogBrandCollections, {
			brand: brand
		});
	}
	
	listByBrand(brand: number, offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(CatalogBrandCollections, {
			brand: brand
		}, {
			limit: limit,
			offset: offset,
			orderBy: { id: "ASC" },
		});
	}
	
	listAll(offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(CatalogBrandCollections, { }, {
			limit: limit,
			offset: offset,
			orderBy: { id: "ASC" },
		});
	}
	
	findAll(emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(CatalogBrandCollections, { }, {
			orderBy: { id: "ASC" },
		});
	}
	
	
}