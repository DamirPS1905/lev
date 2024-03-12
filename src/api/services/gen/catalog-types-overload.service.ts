import { CatalogTypesOverload } from './../../../entities/CatalogTypesOverload'
import { CreateCatalogTypesOverloadDto } from './../../dtos/create-catalog-types-overload.dto'
import { UpdateCatalogTypesOverloadDto } from './../../dtos/update-catalog-types-overload.dto'
import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityManager, wrap } from '@mikro-orm/postgresql'
import { Injectable } from '@nestjs/common'

@Injectable()
export class GenCatalogTypesOverloadService {
	
	constructor(
		protected readonly em: EntityManager,
	){}
	
	async create(createDto: CreateCatalogTypesOverloadDto, emt: EntityManager = null) {
		const em = emt || this.em.fork(),
		      instance = em.create(CatalogTypesOverload, createDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	async update(instance: CatalogTypesOverload, updateDto: UpdateCatalogTypesOverloadDto, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		wrap(instance).assign(updateDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	remove(instance: CatalogTypesOverload, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.remove(instance).flush();
	}
	
	async transactional(cb){ return await this.em.fork().transactional(cb); }
	
	
	findByChildAndParent(child: number, parent: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
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
	
	findAllByParent(parent: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(CatalogTypesOverload, {
			parent: parent
		});
	}
	
	
}