/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/services/catalog-products.service
 * in a proper way.
 */
import { CatalogProducts } from './../../../entities/CatalogProducts';
import { CreateCatalogProductDto } from './../../dtos/create-catalog-product.dto';
import { UpdateCatalogProductDto } from './../../dtos/update-catalog-product.dto';
import { AService } from './../abstract/abstract.service';
import { FilesService } from './../special/files.service';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, wrap } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GenCatalogProductsService extends AService{
	
	constructor(
		em: EntityManager,
		fm: FilesService,
	){ super(em, fm); }
	
	async create(createDto: CreateCatalogProductDto, emt: EntityManager = null) {
		const em = this.getEm(emt),
		      instance = em.create(CatalogProducts, createDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	async update(instance: CatalogProducts, updateDto: UpdateCatalogProductDto, emt: EntityManager = null) {
		const em = this.getEm(emt);
		wrap(instance).assign(updateDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	remove(instance: CatalogProducts, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.remove(instance).flush();
	}
	
	findByCatalogAndTitle(catalog: number, title: string, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.findOne(CatalogProducts, {
			catalog: catalog, title: title
		});
	}
	
	findById(id: bigint, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.findOne(CatalogProducts, {
			id: id
		});
	}
	
	findAllByBrand(brand: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(CatalogProducts, {
			brand: brand
		});
	}
	
	listByBrand(brand: number, offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(CatalogProducts, {
			brand: brand
		}, {
			limit: limit,
			offset: offset,
			orderBy: { id: "ASC" },
		});
	}
	
	findAllByType(type: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(CatalogProducts, {
			type: type
		});
	}
	
	listByType(type: number, offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(CatalogProducts, {
			type: type
		}, {
			limit: limit,
			offset: offset,
			orderBy: { id: "ASC" },
		});
	}
	
	findAllByCatalog(catalog: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(CatalogProducts, {
			catalog: catalog
		});
	}
	
	listByCatalog(catalog: number, offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(CatalogProducts, {
			catalog: catalog
		}, {
			limit: limit,
			offset: offset,
			orderBy: { id: "ASC" },
		});
	}
	
	findAllByCollection(collection: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(CatalogProducts, {
			collection: collection
		});
	}
	
	listByCollection(collection: number, offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(CatalogProducts, {
			collection: collection
		}, {
			limit: limit,
			offset: offset,
			orderBy: { id: "ASC" },
		});
	}
	
	findAllByAccountingUnit(accountingUnit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(CatalogProducts, {
			accountingUnit: accountingUnit
		});
	}
	
	listByAccountingUnit(accountingUnit: number, offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(CatalogProducts, {
			accountingUnit: accountingUnit
		}, {
			limit: limit,
			offset: offset,
			orderBy: { id: "ASC" },
		});
	}
	
	listAll(offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(CatalogProducts, { }, {
			limit: limit,
			offset: offset,
			orderBy: { id: "ASC" },
		});
	}
	
	findAll(emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(CatalogProducts, { }, {
			orderBy: { id: "ASC" },
		});
	}
	
	
}