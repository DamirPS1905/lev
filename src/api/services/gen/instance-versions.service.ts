/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/services/instance-versions.service
 * in a proper way.
 */
import { InstanceVersions } from './../../../entities/InstanceVersions';
import { CreateInstanceVersionDto } from './../../dtos/create-instance-version.dto';
import { UpdateInstanceVersionDto } from './../../dtos/update-instance-version.dto';
import { AService } from './../abstract/abstract.service';
import { FilesService } from './../special/files.service';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, wrap } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GenInstanceVersionsService extends AService{
	
	constructor(
		em: EntityManager,
		fm: FilesService,
	){ super(em, fm); }
	
	async create(createDto: CreateInstanceVersionDto, emt: EntityManager = null) {
		const em = this.getEm(emt),
		      instance = em.create(InstanceVersions, createDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	async update(instance: InstanceVersions, updateDto: UpdateInstanceVersionDto, emt: EntityManager = null) {
		const em = this.getEm(emt);
		wrap(instance).assign(updateDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	remove(instance: InstanceVersions, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.remove(instance).flush();
	}
	
	findByInstanceTypeAndInstance(instanceType: number, instance: bigint, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.findOne(InstanceVersions, {
			instanceType: instanceType, instance: instance
		});
	}
	
	listAll(offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(InstanceVersions, { }, {
			limit: limit,
			offset: offset,
			orderBy: { instanceType: "ASC", instance: "ASC" },
		});
	}
	
	findAll(emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(InstanceVersions, { }, {
			orderBy: { instanceType: "ASC", instance: "ASC" },
		});
	}
	
	
}