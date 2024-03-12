import { CatalogTypes } from './../../../entities/CatalogTypes'
import { CreateCatalogTypeDto } from './../../dtos/create-catalog-type.dto'
import { UpdateCatalogTypeDto } from './../../dtos/update-catalog-type.dto'
import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityManager, wrap } from '@mikro-orm/postgresql'
import { Injectable } from '@nestjs/common'

@Injectable()
export class GenCatalogTypesService {
	
	constructor(
		protected readonly em: EntityManager,
	){}
	
	async create(createDto: CreateCatalogTypeDto, emt: EntityManager = null) {
		const em = emt || this.em.fork(),
		      instance = em.create(CatalogTypes, createDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	async update(instance: CatalogTypes, updateDto: UpdateCatalogTypeDto, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		wrap(instance).assign(updateDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	remove(instance: CatalogTypes, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.remove(instance).flush();
	}
	
	async transactional(cb){ return await this.em.fork().transactional(cb); }
	
	
	findById(id: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.findOne(CatalogTypes, {
			id: id
		});
	}
	
	findByTitleAndParent(title: string, parent: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
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
	
	findAllByParent(parent: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(CatalogTypes, {
			parent: parent
		});
	}
	
	
}