/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/services/catalogs.service
 * in a proper way.
 */
import { Catalogs } from './../../../entities/Catalogs'
import { CreateCatalogDto } from './../../dtos/create-catalog.dto'
import { UpdateCatalogDto } from './../../dtos/update-catalog.dto'
import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityManager, wrap } from '@mikro-orm/postgresql'
import { Injectable } from '@nestjs/common'

@Injectable()
export class GenCatalogsService {
	
	constructor(
		protected readonly em: EntityManager,
	){}
	
	getEm(emt: EntityManager = null) {
		return emt || this.em.fork();
	}
	
	async create(createDto: CreateCatalogDto, emt: EntityManager = null) {
		const em = this.getEm(emt),
		      instance = em.create(Catalogs, createDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	async update(instance: Catalogs, updateDto: UpdateCatalogDto, emt: EntityManager = null) {
		const em = this.getEm(emt);
		wrap(instance).assign(updateDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	remove(instance: Catalogs, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.remove(instance).flush();
	}
	
	async transactional(cb){ return await this.em.fork().transactional(cb); }
	
	
	findByTitleAndCompany(title: string, company: number, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.findOne(Catalogs, {
			title: title, company: company
		});
	}
	
	findById(id: number, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.findOne(Catalogs, {
			id: id
		});
	}
	
	findAllByCompany(company: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(Catalogs, {
			company: company
		});
	}
	
	listByCompany(company: number, offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(Catalogs, {
			company: company
		}, {
			limit: limit,
			offset: offset,
			orderBy: { id: "ASC" },
		});
	}
	
	listAll(offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(Catalogs, { }, {
			limit: limit,
			offset: offset,
			orderBy: { id: "ASC" },
		});
	}
	
	findAll(emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(Catalogs, { }, {
			orderBy: { id: "ASC" },
		});
	}
	
	
}