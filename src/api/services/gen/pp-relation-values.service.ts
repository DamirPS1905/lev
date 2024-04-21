/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/services/pp-relation-values.service
 * in a proper way.
 */
import { PpRelationValues } from './../../../entities/PpRelationValues';
import { CreatePpRelationValueDto } from './../../dtos/create-pp-relation-value.dto';
import { UpdatePpRelationValueDto } from './../../dtos/update-pp-relation-value.dto';
import { AService } from './../abstract/abstract.service';
import { FilesService } from './../special/files.service';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, wrap } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GenPpRelationValuesService extends AService{
	
	constructor(
		em: EntityManager,
		fm: FilesService,
	){ super(em, fm); }
	
	async create(createDto: CreatePpRelationValueDto, emt: EntityManager = null) {
		const em = this.getEm(emt),
		      instance = em.create(PpRelationValues, createDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	async update(instance: PpRelationValues, updateDto: UpdatePpRelationValueDto, emt: EntityManager = null) {
		const em = this.getEm(emt);
		wrap(instance).assign(updateDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	remove(instance: PpRelationValues, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.remove(instance).flush();
	}
	
	findByRelationAndSourceAndTarget(relation: number, source: bigint, target: bigint, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.findOne(PpRelationValues, {
			relation: relation, source: source, target: target
		});
	}
	
	findAllByTarget(target: bigint, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(PpRelationValues, {
			target: target
		});
	}
	
	listByTarget(target: bigint, offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(PpRelationValues, {
			target: target
		}, {
			limit: limit,
			offset: offset,
			orderBy: { relation: "ASC", source: "ASC", target: "ASC" },
		});
	}
	
	findAllBySource(source: bigint, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(PpRelationValues, {
			source: source
		});
	}
	
	listBySource(source: bigint, offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(PpRelationValues, {
			source: source
		}, {
			limit: limit,
			offset: offset,
			orderBy: { relation: "ASC", source: "ASC", target: "ASC" },
		});
	}
	
	findAllByRelation(relation: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(PpRelationValues, {
			relation: relation
		});
	}
	
	listByRelation(relation: number, offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(PpRelationValues, {
			relation: relation
		}, {
			limit: limit,
			offset: offset,
			orderBy: { relation: "ASC", source: "ASC", target: "ASC" },
		});
	}
	
	listAll(offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(PpRelationValues, { }, {
			limit: limit,
			offset: offset,
			orderBy: { relation: "ASC", source: "ASC", target: "ASC" },
		});
	}
	
	findAll(emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(PpRelationValues, { }, {
			orderBy: { relation: "ASC", source: "ASC", target: "ASC" },
		});
	}
	
	
}