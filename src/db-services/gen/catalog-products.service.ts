import { CatalogProducts } from '../../entities/CatalogProducts'
import { CreateCatalogProductsDto } from './dto/create-catalog-products.dto'
import { UpdateCatalogProductsDto } from './dto/update-catalog-products.dto'
import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityManager, wrap } from '@mikro-orm/postgresql'
import { Injectable } from '@nestjs/common'

@Injectable()
export class GenCatalogProductsService {
	
	constructor(
		protected readonly em: EntityManager,
	){}
	
	async create(createDto: CreateCatalogProductsDto, emt: EntityManager = null) {
		const em = emt || this.em.fork(),
		      instance = em.create(CatalogProducts, createDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	async update(instance: CatalogProducts, updateDto: UpdateCatalogProductsDto, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		wrap(instance).assign(updateDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	remove(instance: CatalogProducts, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.remove(instance).flush();
	}
	
	findByCatalogAndTitle(catalog: number, title: string, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.findOne(CatalogProducts, {
			catalog: catalog, title: title
		});
	}
	
	findById(id: number, emt: EntityManager = null) {
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