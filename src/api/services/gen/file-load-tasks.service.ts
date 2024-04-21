/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/services/file-load-tasks.service
 * in a proper way.
 */
import { FileLoadTasks } from './../../../entities/FileLoadTasks';
import { CreateFileLoadTaskDto } from './../../dtos/create-file-load-task.dto';
import { UpdateFileLoadTaskDto } from './../../dtos/update-file-load-task.dto';
import { AService } from './../abstract/abstract.service';
import { FilesService } from './../special/files.service';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, wrap } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GenFileLoadTasksService extends AService{
	
	constructor(
		em: EntityManager,
		fm: FilesService,
	){ super(em, fm); }
	
	async create(createDto: CreateFileLoadTaskDto, emt: EntityManager = null) {
		const em = this.getEm(emt),
		      instance = em.create(FileLoadTasks, createDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	async update(instance: FileLoadTasks, updateDto: UpdateFileLoadTaskDto, emt: EntityManager = null) {
		const em = this.getEm(emt);
		wrap(instance).assign(updateDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	remove(instance: FileLoadTasks, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.remove(instance).flush();
	}
	
	findById(id: bigint, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.findOne(FileLoadTasks, {
			id: id
		});
	}
	
	findAllByCompany(company: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(FileLoadTasks, {
			company: company
		});
	}
	
	listByCompany(company: number, offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(FileLoadTasks, {
			company: company
		}, {
			limit: limit,
			offset: offset,
			orderBy: { id: "ASC" },
		});
	}
	
	listAll(offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(FileLoadTasks, { }, {
			limit: limit,
			offset: offset,
			orderBy: { id: "ASC" },
		});
	}
	
	findAll(emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(FileLoadTasks, { }, {
			orderBy: { id: "ASC" },
		});
	}
	
	
}