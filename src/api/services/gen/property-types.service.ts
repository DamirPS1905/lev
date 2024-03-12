import { PropertyTypes } from './../../../entities/PropertyTypes'
import { CreatePropertyTypeDto } from './../../dtos/create-property-type.dto'
import { UpdatePropertyTypeDto } from './../../dtos/update-property-type.dto'
import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityManager, wrap } from '@mikro-orm/postgresql'
import { Injectable } from '@nestjs/common'

@Injectable()
export class GenPropertyTypesService {
	
	constructor(
		protected readonly em: EntityManager,
	){}
	
	async create(createDto: CreatePropertyTypeDto, emt: EntityManager = null) {
		const em = emt || this.em.fork(),
		      instance = em.create(PropertyTypes, createDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	async update(instance: PropertyTypes, updateDto: UpdatePropertyTypeDto, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		wrap(instance).assign(updateDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	remove(instance: PropertyTypes, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.remove(instance).flush();
	}
	
	async transactional(cb){ return await this.em.fork().transactional(cb); }
	
	
	findById(id: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.findOne(PropertyTypes, {
			id: id
		});
	}
	
	findAllByCatalog(catalog: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(PropertyTypes, {
			catalog: catalog
		});
	}
	
	
}