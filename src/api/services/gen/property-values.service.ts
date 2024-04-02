/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/services/property-values.service
 * in a proper way.
 */
import { PropertyValues } from './../../../entities/PropertyValues'
import { CreatePropertyValueDto } from './../../dtos/create-property-value.dto'
import { UpdatePropertyValueDto } from './../../dtos/update-property-value.dto'
import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityManager, wrap } from '@mikro-orm/postgresql'
import { Injectable } from '@nestjs/common'

@Injectable()
export class GenPropertyValuesService {
	
	constructor(
		protected readonly em: EntityManager,
	){}
	
	getEm(emt: EntityManager = null) {
		return emt || this.em.fork();
	}
	
	async create(createDto: CreatePropertyValueDto, emt: EntityManager = null) {
		const em = this.getEm(emt),
		      instance = em.create(PropertyValues, createDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	async update(instance: PropertyValues, updateDto: UpdatePropertyValueDto, emt: EntityManager = null) {
		const em = this.getEm(emt);
		wrap(instance).assign(updateDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	remove(instance: PropertyValues, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.remove(instance).flush();
	}
	
	async transactional(cb){ return await this.em.fork().transactional(cb); }
	
	
	findByOrderAndValueKey(order: number, valueKey: bigint, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.findOne(PropertyValues, {
			order: order, valueKey: valueKey
		});
	}
	
	findAllByType(type: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(PropertyValues, {
			type: type
		});
	}
	
	listByType(type: number, offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(PropertyValues, {
			type: type
		}, {
			limit: limit,
			offset: offset,
			orderBy: { order: "ASC", valueKey: "ASC" },
		});
	}
	
	listAll(offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(PropertyValues, { }, {
			limit: limit,
			offset: offset,
			orderBy: { order: "ASC", valueKey: "ASC" },
		});
	}
	
	findAll(emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(PropertyValues, { }, {
			orderBy: { order: "ASC", valueKey: "ASC" },
		});
	}
	
	
}