/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/services/catalog-types-overload.service
 * in a proper way.
 */
import { CatalogTypesOverload } from './../../../entities/CatalogTypesOverload';
import { CreateCatalogTypesOverloadDto } from './../../dtos/create-catalog-types-overload.dto';
import { UpdateCatalogTypesOverloadDto } from './../../dtos/update-catalog-types-overload.dto';
import { AService } from './../abstract/abstract.service';
import { FilesService } from './../special/files.service';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, wrap } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GenCatalogTypesOverloadService extends AService{
	
	constructor(
		em: EntityManager,
		fm: FilesService,
	){ super(em, fm); }
	
	async create(createDto: CreateCatalogTypesOverloadDto, emt: EntityManager = null) {
		const em = this.getEm(emt),
		      instance = em.create(CatalogTypesOverload, createDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	async update(instance: CatalogTypesOverload, updateDto: UpdateCatalogTypesOverloadDto, emt: EntityManager = null) {
		const em = this.getEm(emt);
		wrap(instance).assign(updateDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	remove(instance: CatalogTypesOverload, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.remove(instance).flush();
	}
	
	findByChildAndParent(child: number, parent: number, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.findOne(CatalogTypesOverload, {
			child: child, parent: parent
		});
	}
	
	findAllByChild(child: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(CatalogTypesOverload, {
			child: child
		});
	}
	
	listByChild(child: number, offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(CatalogTypesOverload, {
			child: child
		}, {
			limit: limit,
			offset: offset,
			orderBy: { child: "ASC", parent: "ASC" },
		});
	}
	
	findAllByParent(parent: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(CatalogTypesOverload, {
			parent: parent
		});
	}
	
	listByParent(parent: number, offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(CatalogTypesOverload, {
			parent: parent
		}, {
			limit: limit,
			offset: offset,
			orderBy: { child: "ASC", parent: "ASC" },
		});
	}
	
	listAll(offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(CatalogTypesOverload, { }, {
			limit: limit,
			offset: offset,
			orderBy: { child: "ASC", parent: "ASC" },
		});
	}
	
	findAll(emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(CatalogTypesOverload, { }, {
			orderBy: { child: "ASC", parent: "ASC" },
		});
	}
	
	
}