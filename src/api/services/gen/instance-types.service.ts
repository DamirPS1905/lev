/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/services/instance-types.service
 * in a proper way.
 */
import { InstanceTypes } from './../../../entities/InstanceTypes';
import { CreateInstanceTypeDto } from './../../dtos/create-instance-type.dto';
import { UpdateInstanceTypeDto } from './../../dtos/update-instance-type.dto';
import { AService } from './../abstract/abstract.service';
import { FilesService } from './../special/files.service';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, wrap } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GenInstanceTypesService extends AService{
	
	constructor(
		em: EntityManager,
		fm: FilesService,
	){ super(em, fm); }
	
	async create(createDto: CreateInstanceTypeDto, emt: EntityManager = null) {
		const em = this.getEm(emt),
		      instance = em.create(InstanceTypes, createDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	async update(instance: InstanceTypes, updateDto: UpdateInstanceTypeDto, emt: EntityManager = null) {
		const em = this.getEm(emt);
		wrap(instance).assign(updateDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	remove(instance: InstanceTypes, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.remove(instance).flush();
	}
	
	findByTitle(title: string, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.findOne(InstanceTypes, {
			title: title
		});
	}
	
	findById(id: number, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.findOne(InstanceTypes, {
			id: id
		});
	}
	
	listAll(offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(InstanceTypes, { }, {
			limit: limit,
			offset: offset,
			orderBy: { id: "ASC" },
		});
	}
	
	findAll(emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(InstanceTypes, { }, {
			orderBy: { id: "ASC" },
		});
	}
	
	
}