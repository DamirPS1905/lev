/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/services/offer-property-values.service
 * in a proper way.
 */
import { OfferPropertyValues } from './../../../entities/OfferPropertyValues';
import { CreateOfferPropertyValueDto } from './../../dtos/create-offer-property-value.dto';
import { UpdateOfferPropertyValueDto } from './../../dtos/update-offer-property-value.dto';
import { AService } from './../abstract/abstract.service';
import { FilesService } from './../special/files.service';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, wrap } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GenOfferPropertyValuesService extends AService{
	
	constructor(
		em: EntityManager,
		fm: FilesService,
	){ super(em, fm); }
	
	async create(createDto: CreateOfferPropertyValueDto, emt: EntityManager = null) {
		const em = this.getEm(emt),
		      instance = em.create(OfferPropertyValues, createDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	async update(instance: OfferPropertyValues, updateDto: UpdateOfferPropertyValueDto, emt: EntityManager = null) {
		const em = this.getEm(emt);
		wrap(instance).assign(updateDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	remove(instance: OfferPropertyValues, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.remove(instance).flush();
	}
	
	findByOfferAndPropertyAndOrder(offer: bigint, property: number, order: number, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.findOne(OfferPropertyValues, {
			offer: offer, property: property, order: order
		});
	}
	
	findAllByOffer(offer: bigint, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(OfferPropertyValues, {
			offer: offer
		});
	}
	
	listByOffer(offer: bigint, offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(OfferPropertyValues, {
			offer: offer
		}, {
			limit: limit,
			offset: offset,
			orderBy: { offer: "ASC", property: "ASC", order: "ASC" },
		});
	}
	
	findAllByProperty(property: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(OfferPropertyValues, {
			property: property
		});
	}
	
	listByProperty(property: number, offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(OfferPropertyValues, {
			property: property
		}, {
			limit: limit,
			offset: offset,
			orderBy: { offer: "ASC", property: "ASC", order: "ASC" },
		});
	}
	
	listAll(offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(OfferPropertyValues, { }, {
			limit: limit,
			offset: offset,
			orderBy: { offer: "ASC", property: "ASC", order: "ASC" },
		});
	}
	
	findAll(emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(OfferPropertyValues, { }, {
			orderBy: { offer: "ASC", property: "ASC", order: "ASC" },
		});
	}
	
	
}