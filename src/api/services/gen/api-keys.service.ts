/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/services/api-keys.service
 * in a proper way.
 */
import { ApiKeys } from './../../../entities/ApiKeys';
import { CreateApiKeyDto } from './../../dtos/create-api-key.dto';
import { UpdateApiKeyDto } from './../../dtos/update-api-key.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, wrap } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GenApiKeysService {
	
	constructor(
		protected readonly em: EntityManager,
	){}
	
	getEm(emt: EntityManager = null) {
		return emt || this.em.fork();
	}
	
	async create(createDto: CreateApiKeyDto, emt: EntityManager = null) {
		const em = this.getEm(emt),
		      instance = em.create(ApiKeys, createDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	async update(instance: ApiKeys, updateDto: UpdateApiKeyDto, emt: EntityManager = null) {
		const em = this.getEm(emt);
		wrap(instance).assign(updateDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	remove(instance: ApiKeys, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.remove(instance).flush();
	}
	
	async transactional(cb){ return await this.em.fork().transactional(cb); }
	
	
	findByKey(key: string, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.findOne(ApiKeys, {
			key: key
		});
	}
	
	findById(id: number, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.findOne(ApiKeys, {
			id: id
		});
	}
	
	findAllByActor(actor: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(ApiKeys, {
			actor: actor
		});
	}
	
	listByActor(actor: number, offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(ApiKeys, {
			actor: actor
		}, {
			limit: limit,
			offset: offset,
			orderBy: { id: "ASC" },
		});
	}
	
	findAllByCompany(company: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(ApiKeys, {
			company: company
		});
	}
	
	listByCompany(company: number, offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(ApiKeys, {
			company: company
		}, {
			limit: limit,
			offset: offset,
			orderBy: { id: "ASC" },
		});
	}
	
	listAll(offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(ApiKeys, { }, {
			limit: limit,
			offset: offset,
			orderBy: { id: "ASC" },
		});
	}
	
	findAll(emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(ApiKeys, { }, {
			orderBy: { id: "ASC" },
		});
	}
	
	
}