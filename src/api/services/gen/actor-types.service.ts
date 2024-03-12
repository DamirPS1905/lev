import { ActorTypes } from './../../../entities/ActorTypes'
import { CreateActorTypeDto } from './../../dtos/create-actor-type.dto'
import { UpdateActorTypeDto } from './../../dtos/update-actor-type.dto'
import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityManager, wrap } from '@mikro-orm/postgresql'
import { Injectable } from '@nestjs/common'

@Injectable()
export class GenActorTypesService {
	
	constructor(
		protected readonly em: EntityManager,
	){}
	
	async create(createDto: CreateActorTypeDto, emt: EntityManager = null) {
		const em = emt || this.em.fork(),
		      instance = em.create(ActorTypes, createDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	async update(instance: ActorTypes, updateDto: UpdateActorTypeDto, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		wrap(instance).assign(updateDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	remove(instance: ActorTypes, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.remove(instance).flush();
	}
	
	async transactional(cb){ return await this.em.fork().transactional(cb); }
	
	
	findByTitle(title: string, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.findOne(ActorTypes, {
			title: title
		});
	}
	
	findById(id: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.findOne(ActorTypes, {
			id: id
		});
	}
	
	
}