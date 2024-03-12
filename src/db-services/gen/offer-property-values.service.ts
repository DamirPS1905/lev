import { OfferPropertyValues } from '../../entities/OfferPropertyValues'
import { CreateOfferPropertyValuesDto } from './dto/create-offer-property-values.dto'
import { UpdateOfferPropertyValuesDto } from './dto/update-offer-property-values.dto'
import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityManager, wrap } from '@mikro-orm/postgresql'
import { Injectable } from '@nestjs/common'

@Injectable()
export class GenOfferPropertyValuesService {
	
	constructor(
		protected readonly em: EntityManager,
	){}
	
	async create(createDto: CreateOfferPropertyValuesDto, emt: EntityManager = null) {
		const em = emt || this.em.fork(),
		      instance = em.create(OfferPropertyValues, createDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	async update(instance: OfferPropertyValues, updateDto: UpdateOfferPropertyValuesDto, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		wrap(instance).assign(updateDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	remove(instance: OfferPropertyValues, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.remove(instance).flush();
	}
	
	findByOfferAndProperty(offer: number, property: number, emt: EntityManager = null) {
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
	
	findAllByOffer(offer: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(OfferPropertyValues, {
			offer: offer
		});
	}
	
	
}