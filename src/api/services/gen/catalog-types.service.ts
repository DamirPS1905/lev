/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/services/catalog-types.service
 * in a proper way.
 */
import { CatalogTypes } from './../../../entities/CatalogTypes';
import { CreateCatalogTypeDto } from './../../dtos/create-catalog-type.dto';
import { UpdateCatalogTypeDto } from './../../dtos/update-catalog-type.dto';
import { AService } from './../abstract/abstract.service';
import { FilesService } from './../special/files.service';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, wrap } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GenCatalogTypesService extends AService{
	
	constructor(
		em: EntityManager,
		fm: FilesService,
	){ super(em, fm); }
	
	async create(createDto: CreateCatalogTypeDto, emt: EntityManager = null) {
		const em = this.getEm(emt),
		      instance = em.create(CatalogTypes, createDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	async update(instance: CatalogTypes, updateDto: UpdateCatalogTypeDto, emt: EntityManager = null) {
		const em = this.getEm(emt);
		wrap(instance).assign(updateDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	remove(instance: CatalogTypes, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.remove(instance).flush();
	}
	
	findById(id: number, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.findOne(CatalogTypes, {
			id: id
		});
	}
	
	findByTitleAndParent(title: string, parent: number, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.findOne(CatalogTypes, {
			title: title, parent: parent
		});
	}
	
	findAllByCatalog(catalog: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(CatalogTypes, {
			catalog: catalog
		});
	}
	
	listByCatalog(catalog: number, offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(CatalogTypes, {
			catalog: catalog
		}, {
			limit: limit,
			offset: offset,
			orderBy: { id: "ASC" },
		});
	}
	
	findAllByParent(parent: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(CatalogTypes, {
			parent: parent
		});
	}
	
	listByParent(parent: number, offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(CatalogTypes, {
			parent: parent
		}, {
			limit: limit,
			offset: offset,
			orderBy: { id: "ASC" },
		});
	}
	
	listAll(offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(CatalogTypes, { }, {
			limit: limit,
			offset: offset,
			orderBy: { id: "ASC" },
		});
	}
	
	findAll(emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(CatalogTypes, { }, {
			orderBy: { id: "ASC" },
		});
	}
	
	
}