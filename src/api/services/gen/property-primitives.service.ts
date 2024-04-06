/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/services/property-primitives.service
 * in a proper way.
 */
import { PropertyPrimitives } from './../../../entities/PropertyPrimitives'
import { CreatePropertyPrimitiveDto } from './../../dtos/create-property-primitive.dto'
import { UpdatePropertyPrimitiveDto } from './../../dtos/update-property-primitive.dto'
import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityManager, wrap } from '@mikro-orm/postgresql'
import { Injectable } from '@nestjs/common'

@Injectable()
export class GenPropertyPrimitivesService {
	
	constructor(
		protected readonly em: EntityManager,
	){}
	
	getEm(emt: EntityManager = null) {
		return emt || this.em.fork();
	}
	
	async create(createDto: CreatePropertyPrimitiveDto, emt: EntityManager = null) {
		const em = this.getEm(emt),
		      instance = em.create(PropertyPrimitives, createDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	async update(instance: PropertyPrimitives, updateDto: UpdatePropertyPrimitiveDto, emt: EntityManager = null) {
		const em = this.getEm(emt);
		wrap(instance).assign(updateDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	remove(instance: PropertyPrimitives, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.remove(instance).flush();
	}
	
	async transactional(cb){ return await this.em.fork().transactional(cb); }
	
	
	findByTitle(title: string, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.findOne(PropertyPrimitives, {
			title: title
		});
	}
	
	findById(id: number, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.findOne(PropertyPrimitives, {
			id: id
		});
	}
	
	listAll(offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(PropertyPrimitives, { }, {
			limit: limit,
			offset: offset,
			orderBy: { id: "ASC" },
		});
	}
	
	findAll(emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(PropertyPrimitives, { }, {
			orderBy: { id: "ASC" },
		});
	}
	
	
}