import { CatalogTypes } from '../../entities/CatalogTypes'
import { CreateCatalogTypesDto } from './dto/create-catalog-types.dto'
import { UpdateCatalogTypesDto } from './dto/update-catalog-types.dto'
import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityManager, wrap } from '@mikro-orm/postgresql'
import { Injectable } from '@nestjs/common'

@Injectable()
export class GenCatalogTypesService {
	
	constructor(
		protected readonly em: EntityManager,
	){}
	
	async create(createDto: CreateCatalogTypesDto, emt: EntityManager = null) {
		const em = emt || this.em.fork(),
		      instance = em.create(CatalogTypes, createDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	async update(instance: CatalogTypes, updateDto: UpdateCatalogTypesDto, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		wrap(instance).assign(updateDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	remove(instance: CatalogTypes, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.remove(instance).flush();
	}
	
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