import { Actors } from './../../../entities/Actors'
import { CreateActorDto } from './../../dtos/create-actor.dto'
import { UpdateActorDto } from './../../dtos/update-actor.dto'
import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityManager, wrap } from '@mikro-orm/postgresql'
import { Injectable } from '@nestjs/common'

@Injectable()
export class GenActorsService {
	
	constructor(
		protected readonly em: EntityManager,
	){}
	
	async create(createDto: CreateActorDto, emt: EntityManager = null) {
		const em = emt || this.em.fork(),
		      instance = em.create(Actors, createDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	async update(instance: Actors, updateDto: UpdateActorDto, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		wrap(instance).assign(updateDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	remove(instance: Actors, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.remove(instance).flush();
	}
	
	async transactional(cb){ return await this.em.fork().transactional(cb); }
	
	
	findByTypeAndKey(type: number, key: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.findOne(Actors, {
			type: type, key: key
		});
	}
	
	findById(id: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.findOne(Actors, {
			id: id
		});
	}
	
	findAllByType(type: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(Actors, {
			type: type
		});
	}
	
	
}