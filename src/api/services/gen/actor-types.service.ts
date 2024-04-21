/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/services/actor-types.service
 * in a proper way.
 */
import { ActorTypes } from './../../../entities/ActorTypes';
import { CreateActorTypeDto } from './../../dtos/create-actor-type.dto';
import { UpdateActorTypeDto } from './../../dtos/update-actor-type.dto';
import { AService } from './../abstract/abstract.service';
import { FilesService } from './../special/files.service';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, wrap } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GenActorTypesService extends AService{
	
	constructor(
		em: EntityManager,
		fm: FilesService,
	){ super(em, fm); }
	
	async create(createDto: CreateActorTypeDto, emt: EntityManager = null) {
		const em = this.getEm(emt),
		      instance = em.create(ActorTypes, createDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	async update(instance: ActorTypes, updateDto: UpdateActorTypeDto, emt: EntityManager = null) {
		const em = this.getEm(emt);
		wrap(instance).assign(updateDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	remove(instance: ActorTypes, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.remove(instance).flush();
	}
	
	findByTitle(title: string, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.findOne(ActorTypes, {
			title: title
		});
	}
	
	findById(id: number, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.findOne(ActorTypes, {
			id: id
		});
	}
	
	listAll(offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(ActorTypes, { }, {
			limit: limit,
			offset: offset,
			orderBy: { id: "ASC" },
		});
	}
	
	findAll(emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(ActorTypes, { }, {
			orderBy: { id: "ASC" },
		});
	}
	
	
}