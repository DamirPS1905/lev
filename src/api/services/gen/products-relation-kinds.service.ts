/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/services/products-relation-kinds.service
 * in a proper way.
 */
import { ProductsRelationKinds } from './../../../entities/ProductsRelationKinds';
import { CreateProductsRelationKindDto } from './../../dtos/create-products-relation-kind.dto';
import { UpdateProductsRelationKindDto } from './../../dtos/update-products-relation-kind.dto';
import { AService } from './../abstract/abstract.service';
import { FilesService } from './../special/files.service';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, wrap } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GenProductsRelationKindsService extends AService{
	
	constructor(
		em: EntityManager,
		fm: FilesService,
	){ super(em, fm); }
	
	async create(createDto: CreateProductsRelationKindDto, emt: EntityManager = null) {
		const em = this.getEm(emt),
		      instance = em.create(ProductsRelationKinds, createDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	async update(instance: ProductsRelationKinds, updateDto: UpdateProductsRelationKindDto, emt: EntityManager = null) {
		const em = this.getEm(emt);
		wrap(instance).assign(updateDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	remove(instance: ProductsRelationKinds, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.remove(instance).flush();
	}
	
	findByTitle(title: string, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.findOne(ProductsRelationKinds, {
			title: title
		});
	}
	
	findById(id: number, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.findOne(ProductsRelationKinds, {
			id: id
		});
	}
	
	listAll(offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(ProductsRelationKinds, { }, {
			limit: limit,
			offset: offset,
			orderBy: { id: "ASC" },
		});
	}
	
	findAll(emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(ProductsRelationKinds, { }, {
			orderBy: { id: "ASC" },
		});
	}
	
	
}