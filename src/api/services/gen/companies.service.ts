/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/services/companies.service
 * in a proper way.
 */
import { Companies } from './../../../entities/Companies';
import { CreateCompanyDto } from './../../dtos/create-company.dto';
import { UpdateCompanyDto } from './../../dtos/update-company.dto';
import { AService } from './../abstract/abstract.service';
import { FilesService } from './../special/files.service';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, wrap } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GenCompaniesService extends AService{
	
	constructor(
		em: EntityManager,
		fm: FilesService,
	){ super(em, fm); }
	
	async create(createDto: CreateCompanyDto, emt: EntityManager = null) {
		const em = this.getEm(emt),
		      instance = em.create(Companies, createDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	async update(instance: Companies, updateDto: UpdateCompanyDto, emt: EntityManager = null) {
		const em = this.getEm(emt);
		wrap(instance).assign(updateDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	remove(instance: Companies, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.remove(instance).flush();
	}
	
	findById(id: number, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.findOne(Companies, {
			id: id
		});
	}
	
	findByTitle(title: string, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.findOne(Companies, {
			title: title
		});
	}
	
	listAll(offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(Companies, { }, {
			limit: limit,
			offset: offset,
			orderBy: { id: "ASC" },
		});
	}
	
	findAll(emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(Companies, { }, {
			orderBy: { id: "ASC" },
		});
	}
	
	
}