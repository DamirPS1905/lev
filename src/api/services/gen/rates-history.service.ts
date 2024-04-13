/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/services/rates-history.service
 * in a proper way.
 */
import { RatesHistory } from './../../../entities/RatesHistory';
import { CreateRatesHistoryDto } from './../../dtos/create-rates-history.dto';
import { UpdateRatesHistoryDto } from './../../dtos/update-rates-history.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, wrap } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GenRatesHistoryService {
	
	constructor(
		protected readonly em: EntityManager,
	){}
	
	getEm(emt: EntityManager = null) {
		return emt || this.em.fork();
	}
	
	async create(createDto: CreateRatesHistoryDto, emt: EntityManager = null) {
		const em = this.getEm(emt),
		      instance = em.create(RatesHistory, createDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	async update(instance: RatesHistory, updateDto: UpdateRatesHistoryDto, emt: EntityManager = null) {
		const em = this.getEm(emt);
		wrap(instance).assign(updateDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	remove(instance: RatesHistory, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.remove(instance).flush();
	}
	
	async transactional(cb){ return await this.em.fork().transactional(cb); }
	
	
	findByFromAndToAndSourceAndDate(from: number, to: number, source: number, date: string, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.findOne(RatesHistory, {
			from: from, to: to, source: source, date: date
		});
	}
	
	listAll(offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(RatesHistory, { }, {
			limit: limit,
			offset: offset,
			orderBy: { from: "ASC", to: "ASC", source: "ASC", date: "ASC" },
		});
	}
	
	findAll(emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(RatesHistory, { }, {
			orderBy: { from: "ASC", to: "ASC", source: "ASC", date: "ASC" },
		});
	}
	
	
}