/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/services/product-property-values.service
 * in a proper way.
 */
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
	
	getEm(emt: EntityManager = null) {
		return emt || this.em.fork();
	}
	
	async create(createDto: CreateProductPropertyValueDto, emt: EntityManager = null) {
		const em = this.getEm(emt),
		      instance = em.create(ProductPropertyValues, createDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	async update(instance: ProductPropertyValues, updateDto: UpdateProductPropertyValueDto, emt: EntityManager = null) {
		const em = this.getEm(emt);
		wrap(instance).assign(updateDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	remove(instance: ProductPropertyValues, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.remove(instance).flush();
	}
	
	async transactional(cb){ return await this.em.fork().transactional(cb); }
	
	
	findByProductAndProperty(product: bigint, property: number, emt: EntityManager = null) {
		const em = this.getEm(emt);
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