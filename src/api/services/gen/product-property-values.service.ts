import { ProductPropertyValues } from './../../../entities/ProductPropertyValues'
import { CreateProductPropertyValueDto } from './../../dtos/create-product-property-value.dto'
import { UpdateProductPropertyValueDto } from './../../dtos/update-product-property-value.dto'
import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityManager, wrap } from '@mikro-orm/postgresql'
import { Injectable } from '@nestjs/common'

@Injectable()
export class GenProductPropertyValuesService {
	
	constructor(
		protected readonly em: EntityManager,
	){}
	
	async create(createDto: CreateProductPropertyValueDto, emt: EntityManager = null) {
		const em = emt || this.em.fork(),
		      instance = em.create(ProductPropertyValues, createDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	async update(instance: ProductPropertyValues, updateDto: UpdateProductPropertyValueDto, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		wrap(instance).assign(updateDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	remove(instance: ProductPropertyValues, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.remove(instance).flush();
	}
	
	async transactional(cb){ return await this.em.fork().transactional(cb); }
	
	
	findByProductAndProperty(product: bigint, property: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.findOne(ProductPropertyValues, {
			product: product, property: property
		});
	}
	
	findAllByProperty(property: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(ProductPropertyValues, {
			property: property
		});
	}
	
	findAllByProduct(product: bigint, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(ProductPropertyValues, {
			product: product
		});
	}
	
	
}