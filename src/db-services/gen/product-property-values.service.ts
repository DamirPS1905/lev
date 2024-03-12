import { ProductPropertyValues } from '../../entities/ProductPropertyValues'
import { CreateProductPropertyValuesDto } from './dto/create-product-property-values.dto'
import { UpdateProductPropertyValuesDto } from './dto/update-product-property-values.dto'
import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityManager, wrap } from '@mikro-orm/postgresql'
import { Injectable } from '@nestjs/common'

@Injectable()
export class GenProductPropertyValuesService {
	
	constructor(
		protected readonly em: EntityManager,
	){}
	
	async create(createDto: CreateProductPropertyValuesDto, emt: EntityManager = null) {
		const em = emt || this.em.fork(),
		      instance = em.create(ProductPropertyValues, createDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	async update(instance: ProductPropertyValues, updateDto: UpdateProductPropertyValuesDto, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		wrap(instance).assign(updateDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	remove(instance: ProductPropertyValues, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.remove(instance).flush();
	}
	
	findByProductAndProperty(product: number, property: number, emt: EntityManager = null) {
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
	
	findAllByProduct(product: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(ProductPropertyValues, {
			product: product
		});
	}
	
	
}