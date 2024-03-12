import { CatalogBrands } from './../../../entities/CatalogBrands'
import { CreateCatalogBrandDto } from './../../dtos/create-catalog-brand.dto'
import { UpdateCatalogBrandDto } from './../../dtos/update-catalog-brand.dto'
import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityManager, wrap } from '@mikro-orm/postgresql'
import { Injectable } from '@nestjs/common'

@Injectable()
export class GenCatalogBrandsService {
	
	constructor(
		protected readonly em: EntityManager,
	){}
	
	async create(createDto: CreateCatalogBrandDto, emt: EntityManager = null) {
		const em = emt || this.em.fork(),
		      instance = em.create(CatalogBrands, createDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	async update(instance: CatalogBrands, updateDto: UpdateCatalogBrandDto, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		wrap(instance).assign(updateDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	remove(instance: CatalogBrands, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.remove(instance).flush();
	}
	
	async transactional(cb){ return await this.em.fork().transactional(cb); }
	
	
	findByCatalogAndTitle(catalog: number, title: string, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.findOne(CatalogBrands, {
			catalog: catalog, title: title
		});
	}
	
	findById(id: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.findOne(CatalogBrands, {
			id: id
		});
	}
	
	findAllByCatalog(catalog: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(CatalogBrands, {
			catalog: catalog
		});
	}
	
	
}