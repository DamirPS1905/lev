/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/services/property-in-types.service
 * in a proper way.
 */
import { PropertyInTypes } from './../../../entities/PropertyInTypes'
import { CreatePropertyInTypeDto } from './../../dtos/create-property-in-type.dto'
import { UpdatePropertyInTypeDto } from './../../dtos/update-property-in-type.dto'
import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityManager, wrap } from '@mikro-orm/postgresql'
import { Injectable } from '@nestjs/common'

@Injectable()
export class GenPropertyInTypesService {
	
	constructor(
		protected readonly em: EntityManager,
	){}
	
	getEm(emt: EntityManager = null) {
		return emt || this.em.fork();
	}
	
	async create(createDto: CreatePropertyInTypeDto, emt: EntityManager = null) {
		const em = this.getEm(emt),
		      instance = em.create(PropertyInTypes, createDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	async update(instance: PropertyInTypes, updateDto: UpdatePropertyInTypeDto, emt: EntityManager = null) {
		const em = this.getEm(emt);
		wrap(instance).assign(updateDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	remove(instance: PropertyInTypes, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.remove(instance).flush();
	}
	
	async transactional(cb){ return await this.em.fork().transactional(cb); }
	
	
	findByTypeAndProperty(type: number, property: number, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.findOne(PropertyInTypes, {
			type: type, property: property
		});
	}
	
	findAllByProperty(property: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(PropertyInTypes, {
			property: property
		});
	}
	
	listByProperty(property: number, offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(PropertyInTypes, {
			property: property
		}, {
			limit: limit,
			offset: offset,
			orderBy: { type : 'ASC', property : 'ASC' },
		});
	}
	
	findAllByType(type: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(PropertyInTypes, {
			type: type
		});
	}
	
	listByType(type: number, offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(PropertyInTypes, {
			type: type
		}, {
			limit: limit,
			offset: offset,
			orderBy: { type : 'ASC', property : 'ASC' },
		});
	}
	
	listAll(offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(PropertyInTypes, { }, {
			limit: limit,
			offset: offset,
			orderBy: { type : 'ASC', property : 'ASC' },
		});
	}
	
	
}