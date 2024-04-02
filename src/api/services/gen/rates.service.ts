/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/services/rates.service
 * in a proper way.
 */
import { Rates } from './../../../entities/Rates'
import { CreateRateDto } from './../../dtos/create-rate.dto'
import { UpdateRateDto } from './../../dtos/update-rate.dto'
import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityManager, wrap } from '@mikro-orm/postgresql'
import { Injectable } from '@nestjs/common'

@Injectable()
export class GenRatesService {
	
	constructor(
		protected readonly em: EntityManager,
	){}
	
	getEm(emt: EntityManager = null) {
		return emt || this.em.fork();
	}
	
	async create(createDto: CreateRateDto, emt: EntityManager = null) {
		const em = this.getEm(emt),
		      instance = em.create(Rates, createDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	async update(instance: Rates, updateDto: UpdateRateDto, emt: EntityManager = null) {
		const em = this.getEm(emt);
		wrap(instance).assign(updateDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	remove(instance: Rates, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.remove(instance).flush();
	}
	
	async transactional(cb){ return await this.em.fork().transactional(cb); }
	
	
	findByFromAndToAndSource(from: number, to: number, source: number, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.findOne(Rates, {
			from: from, to: to, source: source
		});
	}
	
	findAllBySource(source: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(Rates, {
			source: source
		});
	}
	
	listBySource(source: number, offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(Rates, {
			source: source
		}, {
			limit: limit,
			offset: offset,
			orderBy: { from: "ASC", to: "ASC", source: "ASC" },
		});
	}
	
	findAllByTo(to: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(Rates, {
			to: to
		});
	}
	
	listByTo(to: number, offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(Rates, {
			to: to
		}, {
			limit: limit,
			offset: offset,
			orderBy: { from: "ASC", to: "ASC", source: "ASC" },
		});
	}
	
	findAllByFrom(from: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(Rates, {
			from: from
		});
	}
	
	listByFrom(from: number, offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(Rates, {
			from: from
		}, {
			limit: limit,
			offset: offset,
			orderBy: { from: "ASC", to: "ASC", source: "ASC" },
		});
	}
	
	listAll(offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(Rates, { }, {
			limit: limit,
			offset: offset,
			orderBy: { from: "ASC", to: "ASC", source: "ASC" },
		});
	}
	
	findAll(emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(Rates, { }, {
			orderBy: { from: "ASC", to: "ASC", source: "ASC" },
		});
	}
	
	
}