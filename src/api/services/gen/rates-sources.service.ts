/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/services/rates-sources.service
 * in a proper way.
 */
import { RatesSources } from './../../../entities/RatesSources'
import { CreateRatesSourceDto } from './../../dtos/create-rates-source.dto'
import { UpdateRatesSourceDto } from './../../dtos/update-rates-source.dto'
import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityManager, wrap } from '@mikro-orm/postgresql'
import { Injectable } from '@nestjs/common'

@Injectable()
export class GenRatesSourcesService {
	
	constructor(
		protected readonly em: EntityManager,
	){}
	
	getEm(emt: EntityManager = null) {
		return emt || this.em.fork();
	}
	
	async create(createDto: CreateRatesSourceDto, emt: EntityManager = null) {
		const em = this.getEm(emt),
		      instance = em.create(RatesSources, createDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	async update(instance: RatesSources, updateDto: UpdateRatesSourceDto, emt: EntityManager = null) {
		const em = this.getEm(emt);
		wrap(instance).assign(updateDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	remove(instance: RatesSources, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.remove(instance).flush();
	}
	
	async transactional(cb){ return await this.em.fork().transactional(cb); }
	
	
	findByTitle(title: string, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.findOne(RatesSources, {
			title: title
		});
	}
	
	findById(id: number, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.findOne(RatesSources, {
			id: id
		});
	}
	
	findAllByBaseCurrency(baseCurrency: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(RatesSources, {
			baseCurrency: baseCurrency
		});
	}
	
	listByBaseCurrency(baseCurrency: number, offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(RatesSources, {
			baseCurrency: baseCurrency
		}, {
			limit: limit,
			offset: offset,
			orderBy: { id: "ASC" },
		});
	}
	
	listAll(offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(RatesSources, { }, {
			limit: limit,
			offset: offset,
			orderBy: { id: "ASC" },
		});
	}
	
	findAll(emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(RatesSources, { }, {
			orderBy: { id: "ASC" },
		});
	}
	
	
}