/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/services/brand-property-values.service
 * in a proper way.
 */
import { BrandPropertyValues } from './../../../entities/BrandPropertyValues'
import { CreateBrandPropertyValueDto } from './../../dtos/create-brand-property-value.dto'
import { UpdateBrandPropertyValueDto } from './../../dtos/update-brand-property-value.dto'
import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityManager, wrap } from '@mikro-orm/postgresql'
import { Injectable } from '@nestjs/common'

@Injectable()
export class GenBrandPropertyValuesService {
	
	constructor(
		protected readonly em: EntityManager,
	){}
	
	getEm(emt: EntityManager = null) {
		return emt || this.em.fork();
	}
	
	async create(createDto: CreateBrandPropertyValueDto, emt: EntityManager = null) {
		const em = this.getEm(emt),
		      instance = em.create(BrandPropertyValues, createDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	async update(instance: BrandPropertyValues, updateDto: UpdateBrandPropertyValueDto, emt: EntityManager = null) {
		const em = this.getEm(emt);
		wrap(instance).assign(updateDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	remove(instance: BrandPropertyValues, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.remove(instance).flush();
	}
	
	async transactional(cb){ return await this.em.fork().transactional(cb); }
	
	
	findByInstanceAndPropertyAndOrder(instance: number, property: number, order: number, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.findOne(BrandPropertyValues, {
			instance: instance, property: property, order: order
		});
	}
	
	findAllByProperty(property: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(BrandPropertyValues, {
			property: property
		});
	}
	
	listByProperty(property: number, offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(BrandPropertyValues, {
			property: property
		}, {
			limit: limit,
			offset: offset,
			orderBy: { instance: "ASC", property: "ASC", order: "ASC" },
		});
	}
	
	findAllByInstance(instance: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(BrandPropertyValues, {
			instance: instance
		});
	}
	
	listByInstance(instance: number, offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(BrandPropertyValues, {
			instance: instance
		}, {
			limit: limit,
			offset: offset,
			orderBy: { instance: "ASC", property: "ASC", order: "ASC" },
		});
	}
	
	listAll(offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(BrandPropertyValues, { }, {
			limit: limit,
			offset: offset,
			orderBy: { instance: "ASC", property: "ASC", order: "ASC" },
		});
	}
	
	findAll(emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(BrandPropertyValues, { }, {
			orderBy: { instance: "ASC", property: "ASC", order: "ASC" },
		});
	}
	
	
}