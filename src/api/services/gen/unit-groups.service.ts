/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/services/unit-groups.service
 * in a proper way.
 */
import { UnitGroups } from './../../../entities/UnitGroups';
import { CreateUnitGroupDto } from './../../dtos/create-unit-group.dto';
import { UpdateUnitGroupDto } from './../../dtos/update-unit-group.dto';
import { AService } from './../abstract/abstract.service';
import { FilesService } from './../special/files.service';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, wrap } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GenUnitGroupsService extends AService{
	
	constructor(
		em: EntityManager,
		fm: FilesService,
	){ super(em, fm); }
	
	async create(createDto: CreateUnitGroupDto, emt: EntityManager = null) {
		const em = this.getEm(emt),
		      instance = em.create(UnitGroups, createDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	async update(instance: UnitGroups, updateDto: UpdateUnitGroupDto, emt: EntityManager = null) {
		const em = this.getEm(emt);
		wrap(instance).assign(updateDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	remove(instance: UnitGroups, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.remove(instance).flush();
	}
	
	findById(id: number, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.findOne(UnitGroups, {
			id: id
		});
	}
	
	findAllByCompany(company: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(UnitGroups, {
			company: company
		});
	}
	
	listByCompany(company: number, offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(UnitGroups, {
			company: company
		}, {
			limit: limit,
			offset: offset,
			orderBy: { id: "ASC" },
		});
	}
	
	findAllByBase(base: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(UnitGroups, {
			base: base
		});
	}
	
	listByBase(base: number, offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(UnitGroups, {
			base: base
		}, {
			limit: limit,
			offset: offset,
			orderBy: { id: "ASC" },
		});
	}
	
	listAll(offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(UnitGroups, { }, {
			limit: limit,
			offset: offset,
			orderBy: { id: "ASC" },
		});
	}
	
	findAll(emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(UnitGroups, { }, {
			orderBy: { id: "ASC" },
		});
	}
	
	
}