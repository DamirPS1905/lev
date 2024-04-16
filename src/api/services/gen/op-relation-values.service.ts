/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/services/op-relation-values.service
 * in a proper way.
 */
import { OpRelationValues } from './../../../entities/OpRelationValues';
import { CreateOpRelationValueDto } from './../../dtos/create-op-relation-value.dto';
import { UpdateOpRelationValueDto } from './../../dtos/update-op-relation-value.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, wrap } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GenOpRelationValuesService {
	
	constructor(
		protected readonly em: EntityManager,
	){}
	
	getEm(emt: EntityManager = null) {
		return emt || this.em.fork();
	}
	
	async create(createDto: CreateOpRelationValueDto, emt: EntityManager = null) {
		const em = this.getEm(emt),
		      instance = em.create(OpRelationValues, createDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	async update(instance: OpRelationValues, updateDto: UpdateOpRelationValueDto, emt: EntityManager = null) {
		const em = this.getEm(emt);
		wrap(instance).assign(updateDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	remove(instance: OpRelationValues, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.remove(instance).flush();
	}
	
	async transactional(cb){ return await this.em.fork().transactional(cb); }
	
	
	findByRelationAndSourceAndTarget(relation: number, source: bigint, target: bigint, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.findOne(OpRelationValues, {
			relation: relation, source: source, target: target
		});
	}
	
	findAllByRelation(relation: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(OpRelationValues, {
			relation: relation
		});
	}
	
	listByRelation(relation: number, offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(OpRelationValues, {
			relation: relation
		}, {
			limit: limit,
			offset: offset,
			orderBy: { relation: "ASC", source: "ASC", target: "ASC" },
		});
	}
	
	findAllBySource(source: bigint, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(OpRelationValues, {
			source: source
		});
	}
	
	listBySource(source: bigint, offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(OpRelationValues, {
			source: source
		}, {
			limit: limit,
			offset: offset,
			orderBy: { relation: "ASC", source: "ASC", target: "ASC" },
		});
	}
	
	findAllByTarget(target: bigint, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(OpRelationValues, {
			target: target
		});
	}
	
	listByTarget(target: bigint, offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(OpRelationValues, {
			target: target
		}, {
			limit: limit,
			offset: offset,
			orderBy: { relation: "ASC", source: "ASC", target: "ASC" },
		});
	}
	
	listAll(offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(OpRelationValues, { }, {
			limit: limit,
			offset: offset,
			orderBy: { relation: "ASC", source: "ASC", target: "ASC" },
		});
	}
	
	findAll(emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(OpRelationValues, { }, {
			orderBy: { relation: "ASC", source: "ASC", target: "ASC" },
		});
	}
	
	
}