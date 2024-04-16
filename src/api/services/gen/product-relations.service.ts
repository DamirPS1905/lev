/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/services/product-relations.service
 * in a proper way.
 */
import { ProductRelations } from './../../../entities/ProductRelations';
import { CreateProductRelationDto } from './../../dtos/create-product-relation.dto';
import { UpdateProductRelationDto } from './../../dtos/update-product-relation.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, wrap } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GenProductRelationsService {
	
	constructor(
		protected readonly em: EntityManager,
	){}
	
	getEm(emt: EntityManager = null) {
		return emt || this.em.fork();
	}
	
	async create(createDto: CreateProductRelationDto, emt: EntityManager = null) {
		const em = this.getEm(emt),
		      instance = em.create(ProductRelations, createDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	async update(instance: ProductRelations, updateDto: UpdateProductRelationDto, emt: EntityManager = null) {
		const em = this.getEm(emt);
		wrap(instance).assign(updateDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	remove(instance: ProductRelations, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.remove(instance).flush();
	}
	
	async transactional(cb){ return await this.em.fork().transactional(cb); }
	
	
	findByCatalogAndTitle(catalog: number, title: string, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.findOne(ProductRelations, {
			catalog: catalog, title: title
		});
	}
	
	findById(id: number, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.findOne(ProductRelations, {
			id: id
		});
	}
	
	findAllByKind(kind: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(ProductRelations, {
			kind: kind
		});
	}
	
	listByKind(kind: number, offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(ProductRelations, {
			kind: kind
		}, {
			limit: limit,
			offset: offset,
			orderBy: { id: "ASC" },
		});
	}
	
	findAllByCatalog(catalog: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(ProductRelations, {
			catalog: catalog
		});
	}
	
	listByCatalog(catalog: number, offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(ProductRelations, {
			catalog: catalog
		}, {
			limit: limit,
			offset: offset,
			orderBy: { id: "ASC" },
		});
	}
	
	listAll(offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(ProductRelations, { }, {
			limit: limit,
			offset: offset,
			orderBy: { id: "ASC" },
		});
	}
	
	findAll(emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(ProductRelations, { }, {
			orderBy: { id: "ASC" },
		});
	}
	
	
}