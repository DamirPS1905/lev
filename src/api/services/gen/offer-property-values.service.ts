import { OfferPropertyValues } from './../../../entities/OfferPropertyValues'
import { CreateOfferPropertyValueDto } from './../../dtos/create-offer-property-value.dto'
import { UpdateOfferPropertyValueDto } from './../../dtos/update-offer-property-value.dto'
import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityManager, wrap } from '@mikro-orm/postgresql'
import { Injectable } from '@nestjs/common'

@Injectable()
export class GenOfferPropertyValuesService {
	
	constructor(
		protected readonly em: EntityManager,
	){}
	
	async create(createDto: CreateOfferPropertyValueDto, emt: EntityManager = null) {
		const em = emt || this.em.fork(),
		      instance = em.create(OfferPropertyValues, createDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	async update(instance: OfferPropertyValues, updateDto: UpdateOfferPropertyValueDto, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		wrap(instance).assign(updateDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	remove(instance: OfferPropertyValues, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.remove(instance).flush();
	}
	
	async transactional(cb){ return await this.em.fork().transactional(cb); }
	
	
	findByOfferAndProperty(offer: bigint, property: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.findOne(OfferPropertyValues, {
			offer: offer, property: property
		});
	}
	
	findAllByProperty(property: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(OfferPropertyValues, {
			property: property
		});
	}
	
	findAllByOffer(offer: bigint, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(OfferPropertyValues, {
			offer: offer
		});
	}
	
	
}