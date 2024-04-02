/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/services/offer-amounts.service
 * in a proper way.
 */
import { OfferAmounts } from './../../../entities/OfferAmounts'
import { CreateOfferAmountDto } from './../../dtos/create-offer-amount.dto'
import { UpdateOfferAmountDto } from './../../dtos/update-offer-amount.dto'
import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityManager, wrap } from '@mikro-orm/postgresql'
import { Injectable } from '@nestjs/common'

@Injectable()
export class GenOfferAmountsService {
	
	constructor(
		protected readonly em: EntityManager,
	){}
	
	getEm(emt: EntityManager = null) {
		return emt || this.em.fork();
	}
	
	async create(createDto: CreateOfferAmountDto, emt: EntityManager = null) {
		const em = this.getEm(emt),
		      instance = em.create(OfferAmounts, createDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	async update(instance: OfferAmounts, updateDto: UpdateOfferAmountDto, emt: EntityManager = null) {
		const em = this.getEm(emt);
		wrap(instance).assign(updateDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	remove(instance: OfferAmounts, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.remove(instance).flush();
	}
	
	async transactional(cb){ return await this.em.fork().transactional(cb); }
	
	
	findByOfferAndStore(offer: bigint, store: number, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.findOne(OfferAmounts, {
			offer: offer, store: store
		});
	}
	
	findAllByStore(store: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(OfferAmounts, {
			store: store
		});
	}
	
	listByStore(store: number, offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(OfferAmounts, {
			store: store
		}, {
			limit: limit,
			offset: offset,
			orderBy: { offer: "ASC", store: "ASC" },
		});
	}
	
	findAllByOffer(offer: bigint, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(OfferAmounts, {
			offer: offer
		});
	}
	
	listByOffer(offer: bigint, offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(OfferAmounts, {
			offer: offer
		}, {
			limit: limit,
			offset: offset,
			orderBy: { offer: "ASC", store: "ASC" },
		});
	}
	
	listAll(offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(OfferAmounts, { }, {
			limit: limit,
			offset: offset,
			orderBy: { offer: "ASC", store: "ASC" },
		});
	}
	
	findAll(emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(OfferAmounts, { }, {
			orderBy: { offer: "ASC", store: "ASC" },
		});
	}
	
	
}