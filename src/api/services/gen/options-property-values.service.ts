/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/services/options-property-values.service
 * in a proper way.
 */
import { OptionsPropertyValues } from './../../../entities/OptionsPropertyValues'
import { CreateOptionsPropertyValueDto } from './../../dtos/create-options-property-value.dto'
import { UpdateOptionsPropertyValueDto } from './../../dtos/update-options-property-value.dto'
import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityManager, wrap } from '@mikro-orm/postgresql'
import { Injectable } from '@nestjs/common'

@Injectable()
export class GenOptionsPropertyValuesService {
	
	constructor(
		protected readonly em: EntityManager,
	){}
	
	getEm(emt: EntityManager = null) {
		return emt || this.em.fork();
	}
	
	async create(createDto: CreateOptionsPropertyValueDto, emt: EntityManager = null) {
		const em = this.getEm(emt),
		      instance = em.create(OptionsPropertyValues, createDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	async update(instance: OptionsPropertyValues, updateDto: UpdateOptionsPropertyValueDto, emt: EntityManager = null) {
		const em = this.getEm(emt);
		wrap(instance).assign(updateDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	remove(instance: OptionsPropertyValues, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.remove(instance).flush();
	}
	
	async transactional(cb){ return await this.em.fork().transactional(cb); }
	
	
	findByPropertyAndHash(property: number, hash: string, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.findOne(OptionsPropertyValues, {
			property: property, hash: hash
		});
	}
	
	findByValue(value: bigint, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.findOne(OptionsPropertyValues, {
			value: value
		});
	}
	
	findAllByProperty(property: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(OptionsPropertyValues, {
			property: property
		});
	}
	
	listByProperty(property: number, offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(OptionsPropertyValues, {
			property: property
		}, {
			limit: limit,
			offset: offset,
			orderBy: { value: "ASC" },
		});
	}
	
	findAllByValue(value: bigint, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(OptionsPropertyValues, {
			value: value
		});
	}
	
	listByValue(value: bigint, offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(OptionsPropertyValues, {
			value: value
		}, {
			limit: limit,
			offset: offset,
			orderBy: { value: "ASC" },
		});
	}
	
	listAll(offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(OptionsPropertyValues, { }, {
			limit: limit,
			offset: offset,
			orderBy: { value: "ASC" },
		});
	}
	
	findAll(emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(OptionsPropertyValues, { }, {
			orderBy: { value: "ASC" },
		});
	}
	
	
}