import { CatalogProducts } from './../../../entities/CatalogProducts'
import { CreateCatalogProductDto } from './../../dtos/create-catalog-product.dto'
import { UpdateCatalogProductDto } from './../../dtos/update-catalog-product.dto'
import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityManager, wrap } from '@mikro-orm/postgresql'
import { Injectable } from '@nestjs/common'

@Injectable()
export class GenCatalogProductsService {
	
	constructor(
		protected readonly em: EntityManager,
	){}
	
	async create(createDto: CreateCatalogProductDto, emt: EntityManager = null) {
		const em = emt || this.em.fork(),
		      instance = em.create(CatalogProducts, createDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	async update(instance: CatalogProducts, updateDto: UpdateCatalogProductDto, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		wrap(instance).assign(updateDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	remove(instance: CatalogProducts, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.remove(instance).flush();
	}
	
	async transactional(cb){ return await this.em.fork().transactional(cb); }
	
	
	findByCatalogAndTitle(catalog: number, title: string, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.findOne(CatalogProducts, {
			catalog: catalog, title: title
		});
	}
	
	findById(id: bigint, emt: EntityManager = null) {
		const em = emt || this.em.fork();
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
	
	findAllByType(type: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(CatalogProducts, {
			type: type
		});
	}
	
	findAllByCatalog(catalog: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(CatalogProducts, {
			catalog: catalog
		});
	}
	
	
}