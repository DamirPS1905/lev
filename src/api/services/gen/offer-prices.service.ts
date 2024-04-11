/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/services/offer-prices.service
 * in a proper way.
 */
import { OfferPrices } from './../../../entities/OfferPrices'
import { CreateOfferPriceDto } from './../../dtos/create-offer-price.dto'
import { UpdateOfferPriceDto } from './../../dtos/update-offer-price.dto'
import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityManager, wrap } from '@mikro-orm/postgresql'
import { Injectable } from '@nestjs/common'

@Injectable()
export class GenOfferPricesService {
	
	constructor(
		protected readonly em: EntityManager,
	){}
	
	getEm(emt: EntityManager = null) {
		return emt || this.em.fork();
	}
	
	async create(createDto: CreateOfferPriceDto, emt: EntityManager = null) {
		const em = this.getEm(emt),
		      instance = em.create(OfferPrices, createDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	async update(instance: OfferPrices, updateDto: UpdateOfferPriceDto, emt: EntityManager = null) {
		const em = this.getEm(emt);
		wrap(instance).assign(updateDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	remove(instance: OfferPrices, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.remove(instance).flush();
	}
	
	async transactional(cb){ return await this.em.fork().transactional(cb); }
	
	
	findByOfferAndPriceType(offer: bigint, priceType: number, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.findOne(OfferPrices, {
			offer: offer, priceType: priceType
		});
	}
	
	findAllByPriceType(priceType: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(OfferPrices, {
			priceType: priceType
		});
	}
	
	listByPriceType(priceType: number, offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(OfferPrices, {
			priceType: priceType
		}, {
			limit: limit,
			offset: offset,
			orderBy: { offer: "ASC", priceType: "ASC" },
		});
	}
	
	findAllByOffer(offer: bigint, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(OfferPrices, {
			offer: offer
		});
	}
	
	listByOffer(offer: bigint, offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(OfferPrices, {
			offer: offer
		}, {
			limit: limit,
			offset: offset,
			orderBy: { offer: "ASC", priceType: "ASC" },
		});
	}
	
	listAll(offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(OfferPrices, { }, {
			limit: limit,
			offset: offset,
			orderBy: { offer: "ASC", priceType: "ASC" },
		});
	}
	
	findAll(emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(OfferPrices, { }, {
			orderBy: { offer: "ASC", priceType: "ASC" },
		});
	}
	
	
}