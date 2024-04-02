/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/services/catalog-properties.service
 * in a proper way.
 */
import { CatalogProperties } from './../../../entities/CatalogProperties'
import { CreateCatalogPropertyDto } from './../../dtos/create-catalog-property.dto'
import { UpdateCatalogPropertyDto } from './../../dtos/update-catalog-property.dto'
import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityManager, wrap } from '@mikro-orm/postgresql'
import { Injectable } from '@nestjs/common'

@Injectable()
export class GenCatalogPropertiesService {
	
	constructor(
		protected readonly em: EntityManager,
	){}
	
	getEm(emt: EntityManager = null) {
		return emt || this.em.fork();
	}
	
	async create(createDto: CreateCatalogPropertyDto, emt: EntityManager = null) {
		const em = this.getEm(emt),
		      instance = em.create(CatalogProperties, createDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	async update(instance: CatalogProperties, updateDto: UpdateCatalogPropertyDto, emt: EntityManager = null) {
		const em = this.getEm(emt);
		wrap(instance).assign(updateDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	remove(instance: CatalogProperties, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.remove(instance).flush();
	}
	
	async transactional(cb){ return await this.em.fork().transactional(cb); }
	
	
	findByCatalogAndTitle(catalog: number, title: string, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.findOne(CatalogProperties, {
			catalog: catalog, title: title
		});
	}
	
	findById(id: number, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.findOne(CatalogProperties, {
			id: id
		});
	}
	
	findAllByType(type: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(CatalogProperties, {
			type: type
		});
	}
	
	listByType(type: number, offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(CatalogProperties, {
			type: type
		}, {
			limit: limit,
			offset: offset,
			orderBy: { id: "ASC" },
		});
	}
	
	findAllByCatalog(catalog: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(CatalogProperties, {
			catalog: catalog
		});
	}
	
	listByCatalog(catalog: number, offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(CatalogProperties, {
			catalog: catalog
		}, {
			limit: limit,
			offset: offset,
			orderBy: { id: "ASC" },
		});
	}
	
	listAll(offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(CatalogProperties, { }, {
			limit: limit,
			offset: offset,
			orderBy: { id: "ASC" },
		});
	}
	
	findAll(emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(CatalogProperties, { }, {
			orderBy: { id: "ASC" },
		});
	}
	
	
}