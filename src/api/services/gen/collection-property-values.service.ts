/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/services/collection-property-values.service
 * in a proper way.
 */
import { CollectionPropertyValues } from './../../../entities/CollectionPropertyValues';
import { CreateCollectionPropertyValueDto } from './../../dtos/create-collection-property-value.dto';
import { UpdateCollectionPropertyValueDto } from './../../dtos/update-collection-property-value.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, wrap } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GenCollectionPropertyValuesService {
	
	constructor(
		protected readonly em: EntityManager,
	){}
	
	getEm(emt: EntityManager = null) {
		return emt || this.em.fork();
	}
	
	async create(createDto: CreateCollectionPropertyValueDto, emt: EntityManager = null) {
		const em = this.getEm(emt),
		      instance = em.create(CollectionPropertyValues, createDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	async update(instance: CollectionPropertyValues, updateDto: UpdateCollectionPropertyValueDto, emt: EntityManager = null) {
		const em = this.getEm(emt);
		wrap(instance).assign(updateDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	remove(instance: CollectionPropertyValues, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.remove(instance).flush();
	}
	
	async transactional(cb){ return await this.em.fork().transactional(cb); }
	
	
	findByInstanceAndPropertyAndOrder(instance: number, property: number, order: number, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.findOne(CollectionPropertyValues, {
			instance: instance, property: property, order: order
		});
	}
	
	findAllByInstance(instance: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(CollectionPropertyValues, {
			instance: instance
		});
	}
	
	listByInstance(instance: number, offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(CollectionPropertyValues, {
			instance: instance
		}, {
			limit: limit,
			offset: offset,
			orderBy: { instance: "ASC", property: "ASC", order: "ASC" },
		});
	}
	
	findAllByProperty(property: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(CollectionPropertyValues, {
			property: property
		});
	}
	
	listByProperty(property: number, offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(CollectionPropertyValues, {
			property: property
		}, {
			limit: limit,
			offset: offset,
			orderBy: { instance: "ASC", property: "ASC", order: "ASC" },
		});
	}
	
	listAll(offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(CollectionPropertyValues, { }, {
			limit: limit,
			offset: offset,
			orderBy: { instance: "ASC", property: "ASC", order: "ASC" },
		});
	}
	
	findAll(emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(CollectionPropertyValues, { }, {
			orderBy: { instance: "ASC", property: "ASC", order: "ASC" },
		});
	}
	
	
}