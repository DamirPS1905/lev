/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/services/price-types.service
 * in a proper way.
 */
import { PriceTypes } from './../../../entities/PriceTypes'
import { CreatePriceTypeDto } from './../../dtos/create-price-type.dto'
import { UpdatePriceTypeDto } from './../../dtos/update-price-type.dto'
import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityManager, wrap } from '@mikro-orm/postgresql'
import { Injectable } from '@nestjs/common'

@Injectable()
export class GenPriceTypesService {
	
	constructor(
		protected readonly em: EntityManager,
	){}
	
	getEm(emt: EntityManager = null) {
		return emt || this.em.fork();
	}
	
	async create(createDto: CreatePriceTypeDto, emt: EntityManager = null) {
		const em = this.getEm(emt),
		      instance = em.create(PriceTypes, createDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	async update(instance: PriceTypes, updateDto: UpdatePriceTypeDto, emt: EntityManager = null) {
		const em = this.getEm(emt);
		wrap(instance).assign(updateDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	remove(instance: PriceTypes, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.remove(instance).flush();
	}
	
	async transactional(cb){ return await this.em.fork().transactional(cb); }
	
	
	findByCompanyAndTitle(company: number, title: string, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.findOne(PriceTypes, {
			company: company, title: title
		});
	}
	
	findById(id: number, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.findOne(PriceTypes, {
			id: id
		});
	}
	
	findAllByDisplayCurrency(displayCurrency: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(PriceTypes, {
			displayCurrency: displayCurrency
		});
	}
	
	listByDisplayCurrency(displayCurrency: number, offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(PriceTypes, {
			displayCurrency: displayCurrency
		}, {
			limit: limit,
			offset: offset,
			orderBy: { id : 'ASC' },
		});
	}
	
	findAllByCompany(company: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(PriceTypes, {
			company: company
		});
	}
	
	listByCompany(company: number, offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(PriceTypes, {
			company: company
		}, {
			limit: limit,
			offset: offset,
			orderBy: { id : 'ASC' },
		});
	}
	
	listAll(offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(PriceTypes, { }, {
			limit: limit,
			offset: offset,
			orderBy: { id : 'ASC' },
		});
	}
	
	
}