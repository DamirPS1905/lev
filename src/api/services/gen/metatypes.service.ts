/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/services/metatypes.service
 * in a proper way.
 */
import { Metatypes } from './../../../entities/Metatypes'
import { CreateMetatypeDto } from './../../dtos/create-metatype.dto'
import { UpdateMetatypeDto } from './../../dtos/update-metatype.dto'
import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityManager, wrap } from '@mikro-orm/postgresql'
import { Injectable } from '@nestjs/common'

@Injectable()
export class GenMetatypesService {
	
	constructor(
		protected readonly em: EntityManager,
	){}
	
	getEm(emt: EntityManager = null) {
		return emt || this.em.fork();
	}
	
	async create(createDto: CreateMetatypeDto, emt: EntityManager = null) {
		const em = this.getEm(emt),
		      instance = em.create(Metatypes, createDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	async update(instance: Metatypes, updateDto: UpdateMetatypeDto, emt: EntityManager = null) {
		const em = this.getEm(emt);
		wrap(instance).assign(updateDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	remove(instance: Metatypes, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.remove(instance).flush();
	}
	
	async transactional(cb){ return await this.em.fork().transactional(cb); }
	
	
	findByTitle(title: string, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.findOne(Metatypes, {
			title: title
		});
	}
	
	findById(id: number, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.findOne(Metatypes, {
			id: id
		});
	}
	
	listAll(offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(Metatypes, { }, {
			limit: limit,
			offset: offset,
			orderBy: { id : 'ASC' },
		});
	}
	
	
}