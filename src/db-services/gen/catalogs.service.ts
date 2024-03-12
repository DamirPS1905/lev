import { Catalogs } from '../../entities/Catalogs'
import { CreateCatalogsDto } from './dto/create-catalogs.dto'
import { UpdateCatalogsDto } from './dto/update-catalogs.dto'
import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityManager, wrap } from '@mikro-orm/postgresql'
import { Injectable } from '@nestjs/common'

@Injectable()
export class GenCatalogsService {
	
	constructor(
		protected readonly em: EntityManager,
	){}
	
	async create(createDto: CreateCatalogsDto, emt: EntityManager = null) {
		const em = emt || this.em.fork(),
		      instance = em.create(Catalogs, createDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	async update(instance: Catalogs, updateDto: UpdateCatalogsDto, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		wrap(instance).assign(updateDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	remove(instance: Catalogs, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.remove(instance).flush();
	}
	
	findByTitleAndCompany(title: string, company: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.findOne(Catalogs, {
			title: title, company: company
		});
	}
	
	findById(id: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.findOne(Catalogs, {
			id: id
		});
	}
	
	
}