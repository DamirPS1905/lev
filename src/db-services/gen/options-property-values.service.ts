import { OptionsPropertyValues } from '../../entities/OptionsPropertyValues'
import { CreateOptionsPropertyValuesDto } from './dto/create-options-property-values.dto'
import { UpdateOptionsPropertyValuesDto } from './dto/update-options-property-values.dto'
import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityManager, wrap } from '@mikro-orm/postgresql'
import { Injectable } from '@nestjs/common'

@Injectable()
export class GenOptionsPropertyValuesService {
	
	constructor(
		protected readonly em: EntityManager,
	){}
	
	async create(createDto: CreateOptionsPropertyValuesDto, emt: EntityManager = null) {
		const em = emt || this.em.fork(),
		      instance = em.create(OptionsPropertyValues, createDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	async update(instance: OptionsPropertyValues, updateDto: UpdateOptionsPropertyValuesDto, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		wrap(instance).assign(updateDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	remove(instance: OptionsPropertyValues, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.remove(instance).flush();
	}
	
	findById(id: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.findOne(OptionsPropertyValues, {
			id: id
		});
	}
	
	findByPropertyAndHash(property: number, hash: string, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.findOne(OptionsPropertyValues, {
			property: property, hash: hash
		});
	}
	
	findAllByProperty(property: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(OptionsPropertyValues, {
			property: property
		});
	}
	
	
}