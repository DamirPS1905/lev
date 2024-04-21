/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/services/property-types.service
 * in a proper way.
 */
import { PropertyTypes } from './../../../entities/PropertyTypes';
import { CreatePropertyTypeDto } from './../../dtos/create-property-type.dto';
import { UpdatePropertyTypeDto } from './../../dtos/update-property-type.dto';
import { AService } from './../abstract/abstract.service';
import { FilesService } from './../special/files.service';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, wrap } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GenPropertyTypesService extends AService{
	
	constructor(
		em: EntityManager,
		fm: FilesService,
	){ super(em, fm); }
	
	async create(createDto: CreatePropertyTypeDto, emt: EntityManager = null) {
		const em = this.getEm(emt),
		      instance = em.create(PropertyTypes, createDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	async update(instance: PropertyTypes, updateDto: UpdatePropertyTypeDto, emt: EntityManager = null) {
		const em = this.getEm(emt);
		wrap(instance).assign(updateDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	remove(instance: PropertyTypes, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.remove(instance).flush();
	}
	
	findById(id: number, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.findOne(PropertyTypes, {
			id: id
		});
	}
	
	findAllByCatalog(catalog: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(PropertyTypes, {
			catalog: catalog
		});
	}
	
	listByCatalog(catalog: number, offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(PropertyTypes, {
			catalog: catalog
		}, {
			limit: limit,
			offset: offset,
			orderBy: { id: "ASC" },
		});
	}
	
	listAll(offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(PropertyTypes, { }, {
			limit: limit,
			offset: offset,
			orderBy: { id: "ASC" },
		});
	}
	
	findAll(emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(PropertyTypes, { }, {
			orderBy: { id: "ASC" },
		});
	}
	
	
}