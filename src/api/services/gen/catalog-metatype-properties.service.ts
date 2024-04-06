/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/services/catalog-metatype-properties.service
 * in a proper way.
 */
import { CatalogMetatypeProperties } from './../../../entities/CatalogMetatypeProperties'
import { CreateCatalogMetatypePropertyDto } from './../../dtos/create-catalog-metatype-property.dto'
import { UpdateCatalogMetatypePropertyDto } from './../../dtos/update-catalog-metatype-property.dto'
import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityManager, wrap } from '@mikro-orm/postgresql'
import { Injectable } from '@nestjs/common'

@Injectable()
export class GenCatalogMetatypePropertiesService {
	
	constructor(
		protected readonly em: EntityManager,
	){}
	
	getEm(emt: EntityManager = null) {
		return emt || this.em.fork();
	}
	
	async create(createDto: CreateCatalogMetatypePropertyDto, emt: EntityManager = null) {
		const em = this.getEm(emt),
		      instance = em.create(CatalogMetatypeProperties, createDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	async update(instance: CatalogMetatypeProperties, updateDto: UpdateCatalogMetatypePropertyDto, emt: EntityManager = null) {
		const em = this.getEm(emt);
		wrap(instance).assign(updateDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	remove(instance: CatalogMetatypeProperties, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.remove(instance).flush();
	}
	
	async transactional(cb){ return await this.em.fork().transactional(cb); }
	
	
	findByCatalogAndPropertyAndMetatype(catalog: number, property: number, metatype: number, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.findOne(CatalogMetatypeProperties, {
			catalog: catalog, property: property, metatype: metatype
		});
	}
	
	findAllByProperty(property: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(CatalogMetatypeProperties, {
			property: property
		});
	}
	
	listByProperty(property: number, offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(CatalogMetatypeProperties, {
			property: property
		}, {
			limit: limit,
			offset: offset,
			orderBy: { catalog: "ASC", property: "ASC", metatype: "ASC" },
		});
	}
	
	findAllByMetatype(metatype: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(CatalogMetatypeProperties, {
			metatype: metatype
		});
	}
	
	listByMetatype(metatype: number, offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(CatalogMetatypeProperties, {
			metatype: metatype
		}, {
			limit: limit,
			offset: offset,
			orderBy: { catalog: "ASC", property: "ASC", metatype: "ASC" },
		});
	}
	
	findAllByCatalog(catalog: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(CatalogMetatypeProperties, {
			catalog: catalog
		});
	}
	
	listByCatalog(catalog: number, offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(CatalogMetatypeProperties, {
			catalog: catalog
		}, {
			limit: limit,
			offset: offset,
			orderBy: { catalog: "ASC", property: "ASC", metatype: "ASC" },
		});
	}
	
	listAll(offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(CatalogMetatypeProperties, { }, {
			limit: limit,
			offset: offset,
			orderBy: { catalog: "ASC", property: "ASC", metatype: "ASC" },
		});
	}
	
	findAll(emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(CatalogMetatypeProperties, { }, {
			orderBy: { catalog: "ASC", property: "ASC", metatype: "ASC" },
		});
	}
	
	
}