/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/services/users.service
 * in a proper way.
 */
import { Users } from './../../../entities/Users';
import { CreateUserDto } from './../../dtos/create-user.dto';
import { UpdateUserDto } from './../../dtos/update-user.dto';
import { AService } from './../abstract/abstract.service';
import { FilesService } from './../special/files.service';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, wrap } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GenUsersService extends AService{
	
	constructor(
		em: EntityManager,
		fm: FilesService,
	){ super(em, fm); }
	
	async create(createDto: CreateUserDto, emt: EntityManager = null) {
		const em = this.getEm(emt),
		      instance = em.create(Users, createDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	async update(instance: Users, updateDto: UpdateUserDto, emt: EntityManager = null) {
		const em = this.getEm(emt);
		wrap(instance).assign(updateDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	remove(instance: Users, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.remove(instance).flush();
	}
	
	findByLogin(login: string, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.findOne(Users, {
			login: login
		});
	}
	
	findById(id: number, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.findOne(Users, {
			id: id
		});
	}
	
	findByActor(actor: number, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.findOne(Users, {
			actor: actor
		});
	}
	
	findAllByActor(actor: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(Users, {
			actor: actor
		});
	}
	
	listByActor(actor: number, offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(Users, {
			actor: actor
		}, {
			limit: limit,
			offset: offset,
			orderBy: { id: "ASC" },
		});
	}
	
	findAllByCompany(company: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(Users, {
			company: company
		});
	}
	
	listByCompany(company: number, offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(Users, {
			company: company
		}, {
			limit: limit,
			offset: offset,
			orderBy: { id: "ASC" },
		});
	}
	
	listAll(offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(Users, { }, {
			limit: limit,
			offset: offset,
			orderBy: { id: "ASC" },
		});
	}
	
	findAll(emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(Users, { }, {
			orderBy: { id: "ASC" },
		});
	}
	
	
}