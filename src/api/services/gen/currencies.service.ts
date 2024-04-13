/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/services/currencies.service
 * in a proper way.
 */
import { Currencies } from './../../../entities/Currencies';
import { CreateCurrencyDto } from './../../dtos/create-currency.dto';
import { UpdateCurrencyDto } from './../../dtos/update-currency.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, wrap } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GenCurrenciesService {
	
	constructor(
		protected readonly em: EntityManager,
	){}
	
	getEm(emt: EntityManager = null) {
		return emt || this.em.fork();
	}
	
	async create(createDto: CreateCurrencyDto, emt: EntityManager = null) {
		const em = this.getEm(emt),
		      instance = em.create(Currencies, createDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	async update(instance: Currencies, updateDto: UpdateCurrencyDto, emt: EntityManager = null) {
		const em = this.getEm(emt);
		wrap(instance).assign(updateDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	remove(instance: Currencies, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.remove(instance).flush();
	}
	
	async transactional(cb){ return await this.em.fork().transactional(cb); }
	
	
	findByTitle(title: string, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.findOne(Currencies, {
			title: title
		});
	}
	
	findByKey(key: string, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.findOne(Currencies, {
			key: key
		});
	}
	
	findById(id: number, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.findOne(Currencies, {
			id: id
		});
	}
	
	listAll(offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(Currencies, { }, {
			limit: limit,
			offset: offset,
			orderBy: { id: "ASC" },
		});
	}
	
	findAll(emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(Currencies, { }, {
			orderBy: { id: "ASC" },
		});
	}
	
	
}