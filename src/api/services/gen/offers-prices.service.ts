/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/services/offers-prices.service
 * in a proper way.
 */
import { OffersPrices } from './../../../entities/OffersPrices'
import { CreateOffersPriceDto } from './../../dtos/create-offers-price.dto'
import { UpdateOffersPriceDto } from './../../dtos/update-offers-price.dto'
import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityManager, wrap } from '@mikro-orm/postgresql'
import { Injectable } from '@nestjs/common'

@Injectable()
export class GenOffersPricesService {
	
	constructor(
		protected readonly em: EntityManager,
	){}
	
	getEm(emt: EntityManager = null) {
		return emt || this.em.fork();
	}
	
	async create(createDto: CreateOffersPriceDto, emt: EntityManager = null) {
		const em = this.getEm(emt),
		      instance = em.create(OffersPrices, createDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	async update(instance: OffersPrices, updateDto: UpdateOffersPriceDto, emt: EntityManager = null) {
		const em = this.getEm(emt);
		wrap(instance).assign(updateDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	remove(instance: OffersPrices, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.remove(instance).flush();
	}
	
	async transactional(cb){ return await this.em.fork().transactional(cb); }
	
	
	findByOfferAndPriceType(offer: bigint, priceType: number, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.findOne(OffersPrices, {
			offer: offer, priceType: priceType
		});
	}
	
	findAllByPriceType(priceType: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(OffersPrices, {
			priceType: priceType
		});
	}
	
	listByPriceType(priceType: number, offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(OffersPrices, {
			priceType: priceType
		}, {
			limit: limit,
			offset: offset,
			orderBy: { offer: "ASC", priceType: "ASC" },
		});
	}
	
	findAllByOffer(offer: bigint, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(OffersPrices, {
			offer: offer
		});
	}
	
	listByOffer(offer: bigint, offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(OffersPrices, {
			offer: offer
		}, {
			limit: limit,
			offset: offset,
			orderBy: { offer: "ASC", priceType: "ASC" },
		});
	}
	
	listAll(offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(OffersPrices, { }, {
			limit: limit,
			offset: offset,
			orderBy: { offer: "ASC", priceType: "ASC" },
		});
	}
	
	findAll(emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(OffersPrices, { }, {
			orderBy: { offer: "ASC", priceType: "ASC" },
		});
	}
	
	
}