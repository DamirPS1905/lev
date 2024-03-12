import { ApiKeys } from './../../../entities/ApiKeys'
import { CreateApiKeyDto } from './../../dtos/create-api-key.dto'
import { UpdateApiKeyDto } from './../../dtos/update-api-key.dto'
import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityManager, wrap } from '@mikro-orm/postgresql'
import { Injectable } from '@nestjs/common'

@Injectable()
export class GenApiKeysService {
	
	constructor(
		protected readonly em: EntityManager,
	){}
	
	async create(createDto: CreateApiKeyDto, emt: EntityManager = null) {
		const em = emt || this.em.fork(),
		      instance = em.create(ApiKeys, createDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	async update(instance: ApiKeys, updateDto: UpdateApiKeyDto, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		wrap(instance).assign(updateDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	remove(instance: ApiKeys, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.remove(instance).flush();
	}
	
	async transactional(cb){ return await this.em.fork().transactional(cb); }
	
	
	findByKey(key: string, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.findOne(ApiKeys, {
			key: key
		});
	}
	
	findById(id: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
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
	
	findAllByCompany(company: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(ApiKeys, {
			company: company
		});
	}
	
	
}