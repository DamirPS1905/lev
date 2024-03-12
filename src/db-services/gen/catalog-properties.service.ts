import { CatalogProperties } from '../../entities/CatalogProperties'
import { CreateCatalogPropertiesDto } from './dto/create-catalog-properties.dto'
import { UpdateCatalogPropertiesDto } from './dto/update-catalog-properties.dto'
import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityManager, wrap } from '@mikro-orm/postgresql'
import { Injectable } from '@nestjs/common'

@Injectable()
export class GenCatalogPropertiesService {
	
	constructor(
		protected readonly em: EntityManager,
	){}
	
	async create(createDto: CreateCatalogPropertiesDto, emt: EntityManager = null) {
		const em = emt || this.em.fork(),
		      instance = em.create(CatalogProperties, createDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	async update(instance: CatalogProperties, updateDto: UpdateCatalogPropertiesDto, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		wrap(instance).assign(updateDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	remove(instance: CatalogProperties, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.remove(instance).flush();
	}
	
	findByCatalogAndTitle(catalog: number, title: string, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.findOne(CatalogProperties, {
			catalog: catalog, title: title
		});
	}
	
	findById(id: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.findOne(CatalogProperties, {
			id: id
		});
	}
	
	findAllByType(type: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(CatalogProperties, {
			type: type
		});
	}
	
	
}