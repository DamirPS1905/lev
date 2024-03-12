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
	
	async create(createDto: CreateCatalogDto, emt: EntityManager = null) {
		const em = emt || this.em.fork(),
		      instance = em.create(Catalogs, createDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	async update(instance: Catalogs, updateDto: UpdateCatalogDto, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		wrap(instance).assign(updateDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	remove(instance: Catalogs, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.remove(instance).flush();
	}
	
	async transactional(cb){ return await this.em.fork().transactional(cb); }
	
	
	findByTitleAndCompany(title: string, company: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.findOne(Catalogs, {
			title: title, company: company
		});
	}
	
	findById(id: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
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
	
	
}