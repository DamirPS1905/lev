import { PropertyTypes } from '../../entities/PropertyTypes'
import { CreatePropertyTypesDto } from './dto/create-property-types.dto'
import { UpdatePropertyTypesDto } from './dto/update-property-types.dto'
import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityManager, wrap } from '@mikro-orm/postgresql'
import { Injectable } from '@nestjs/common'

@Injectable()
export class GenPropertyTypesService {
	
	constructor(
		protected readonly em: EntityManager,
	){}
	
	async create(createDto: CreatePropertyTypesDto, emt: EntityManager = null) {
		const em = emt || this.em.fork(),
		      instance = em.create(PropertyTypes, createDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	async update(instance: PropertyTypes, updateDto: UpdatePropertyTypesDto, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		wrap(instance).assign(updateDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	remove(instance: PropertyTypes, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.remove(instance).flush();
	}
	
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