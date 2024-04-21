/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/services/po-relation-values.service
 * in a proper way.
 */
import { PoRelationValues } from './../../../entities/PoRelationValues';
import { CreatePoRelationValueDto } from './../../dtos/create-po-relation-value.dto';
import { UpdatePoRelationValueDto } from './../../dtos/update-po-relation-value.dto';
import { AService } from './../abstract/abstract.service';
import { FilesService } from './../special/files.service';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, wrap } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GenPoRelationValuesService extends AService{
	
	constructor(
		em: EntityManager,
		fm: FilesService,
	){ super(em, fm); }
	
	async create(createDto: CreatePoRelationValueDto, emt: EntityManager = null) {
		const em = this.getEm(emt),
		      instance = em.create(PoRelationValues, createDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	async update(instance: PoRelationValues, updateDto: UpdatePoRelationValueDto, emt: EntityManager = null) {
		const em = this.getEm(emt);
		wrap(instance).assign(updateDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	remove(instance: PoRelationValues, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.remove(instance).flush();
	}
	
	findByRelationAndSourceAndTarget(relation: number, source: bigint, target: bigint, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.findOne(PoRelationValues, {
			relation: relation, source: source, target: target
		});
	}
	
	findAllByRelation(relation: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(PoRelationValues, {
			relation: relation
		});
	}
	
	listByRelation(relation: number, offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(PoRelationValues, {
			relation: relation
		}, {
			limit: limit,
			offset: offset,
			orderBy: { relation: "ASC", source: "ASC", target: "ASC" },
		});
	}
	
	findAllByTarget(target: bigint, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(PoRelationValues, {
			target: target
		});
	}
	
	listByTarget(target: bigint, offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(PoRelationValues, {
			target: target
		}, {
			limit: limit,
			offset: offset,
			orderBy: { relation: "ASC", source: "ASC", target: "ASC" },
		});
	}
	
	findAllBySource(source: bigint, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(PoRelationValues, {
			source: source
		});
	}
	
	listBySource(source: bigint, offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(PoRelationValues, {
			source: source
		}, {
			limit: limit,
			offset: offset,
			orderBy: { relation: "ASC", source: "ASC", target: "ASC" },
		});
	}
	
	listAll(offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(PoRelationValues, { }, {
			limit: limit,
			offset: offset,
			orderBy: { relation: "ASC", source: "ASC", target: "ASC" },
		});
	}
	
	findAll(emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(PoRelationValues, { }, {
			orderBy: { relation: "ASC", source: "ASC", target: "ASC" },
		});
	}
	
	
}