/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/services/catalog-metatypes.service
 * in a proper way.
 */
import { CatalogMetatypes } from './../../../entities/CatalogMetatypes'
import { CreateCatalogMetatypeDto } from './../../dtos/create-catalog-metatype.dto'
import { UpdateCatalogMetatypeDto } from './../../dtos/update-catalog-metatype.dto'
import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityManager, wrap } from '@mikro-orm/postgresql'
import { Injectable } from '@nestjs/common'

@Injectable()
export class GenCatalogMetatypesService {
	
	constructor(
		protected readonly em: EntityManager,
	){}
	
	getEm(emt: EntityManager = null) {
		return emt || this.em.fork();
	}
	
	async create(createDto: CreateCatalogMetatypeDto, emt: EntityManager = null) {
		const em = this.getEm(emt),
		      instance = em.create(CatalogMetatypes, createDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	async update(instance: CatalogMetatypes, updateDto: UpdateCatalogMetatypeDto, emt: EntityManager = null) {
		const em = this.getEm(emt);
		wrap(instance).assign(updateDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	remove(instance: CatalogMetatypes, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.remove(instance).flush();
	}
	
	async transactional(cb){ return await this.em.fork().transactional(cb); }
	
	
	findByCatalogAndMetatype(catalog: number, metatype: number, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.findOne(CatalogMetatypes, {
			catalog: catalog, metatype: metatype
		});
	}
	
	findById(id: number, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.findOne(CatalogMetatypes, {
			id: id
		});
	}
	
	findAllByMetatype(metatype: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(CatalogMetatypes, {
			metatype: metatype
		});
	}
	
	listByMetatype(metatype: number, offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(CatalogMetatypes, {
			metatype: metatype
		}, {
			limit: limit,
			offset: offset,
			orderBy: { id: "ASC" },
		});
	}
	
	findAllByCatalog(catalog: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(CatalogMetatypes, {
			catalog: catalog
		});
	}
	
	listByCatalog(catalog: number, offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(CatalogMetatypes, {
			catalog: catalog
		}, {
			limit: limit,
			offset: offset,
			orderBy: { id: "ASC" },
		});
	}
	
	listAll(offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(CatalogMetatypes, { }, {
			limit: limit,
			offset: offset,
			orderBy: { id: "ASC" },
		});
	}
	
	findAll(emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(CatalogMetatypes, { }, {
			orderBy: { id: "ASC" },
		});
	}
	
	
}