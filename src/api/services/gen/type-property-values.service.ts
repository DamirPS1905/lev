/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/services/type-property-values.service
 * in a proper way.
 */
import { TypePropertyValues } from './../../../entities/TypePropertyValues'
import { CreateTypePropertyValueDto } from './../../dtos/create-type-property-value.dto'
import { UpdateTypePropertyValueDto } from './../../dtos/update-type-property-value.dto'
import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityManager, wrap } from '@mikro-orm/postgresql'
import { Injectable } from '@nestjs/common'

@Injectable()
export class GenTypePropertyValuesService {
	
	constructor(
		protected readonly em: EntityManager,
	){}
	
	getEm(emt: EntityManager = null) {
		return emt || this.em.fork();
	}
	
	async create(createDto: CreateTypePropertyValueDto, emt: EntityManager = null) {
		const em = this.getEm(emt),
		      instance = em.create(TypePropertyValues, createDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	async update(instance: TypePropertyValues, updateDto: UpdateTypePropertyValueDto, emt: EntityManager = null) {
		const em = this.getEm(emt);
		wrap(instance).assign(updateDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	remove(instance: TypePropertyValues, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.remove(instance).flush();
	}
	
	async transactional(cb){ return await this.em.fork().transactional(cb); }
	
	
	findByTypeAndProperty(type: number, property: number, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.findOne(TypePropertyValues, {
			type: type, property: property
		});
	}
	
	findAllByProperty(property: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(TypePropertyValues, {
			property: property
		});
	}
	
	listByProperty(property: number, offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(TypePropertyValues, {
			property: property
		}, {
			limit: limit,
			offset: offset,
			orderBy: { type: "ASC", property: "ASC" },
		});
	}
	
	findAllByType(type: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(TypePropertyValues, {
			type: type
		});
	}
	
	listByType(type: number, offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(TypePropertyValues, {
			type: type
		}, {
			limit: limit,
			offset: offset,
			orderBy: { type: "ASC", property: "ASC" },
		});
	}
	
	listAll(offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(TypePropertyValues, { }, {
			limit: limit,
			offset: offset,
			orderBy: { type: "ASC", property: "ASC" },
		});
	}
	
	findAll(emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(TypePropertyValues, { }, {
			orderBy: { type: "ASC", property: "ASC" },
		});
	}
	
	
}