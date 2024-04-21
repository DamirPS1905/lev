/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/services/product-prices.service
 * in a proper way.
 */
import { ProductPrices } from './../../../entities/ProductPrices';
import { CreateProductPriceDto } from './../../dtos/create-product-price.dto';
import { UpdateProductPriceDto } from './../../dtos/update-product-price.dto';
import { AService } from './../abstract/abstract.service';
import { FilesService } from './../special/files.service';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, wrap } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GenProductPricesService extends AService{
	
	constructor(
		em: EntityManager,
		fm: FilesService,
	){ super(em, fm); }
	
	async create(createDto: CreateProductPriceDto, emt: EntityManager = null) {
		const em = this.getEm(emt),
		      instance = em.create(ProductPrices, createDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	async update(instance: ProductPrices, updateDto: UpdateProductPriceDto, emt: EntityManager = null) {
		const em = this.getEm(emt);
		wrap(instance).assign(updateDto);
		await em.persist(instance).flush();
		return instance;
	}
	
	remove(instance: ProductPrices, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.remove(instance).flush();
	}
	
	findByProductAndPriceType(product: bigint, priceType: number, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.findOne(ProductPrices, {
			product: product, priceType: priceType
		});
	}
	
	findAllByPriceType(priceType: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(ProductPrices, {
			priceType: priceType
		});
	}
	
	listByPriceType(priceType: number, offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(ProductPrices, {
			priceType: priceType
		}, {
			limit: limit,
			offset: offset,
			orderBy: { product: "ASC", priceType: "ASC" },
		});
	}
	
	findAllByProduct(product: bigint, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(ProductPrices, {
			product: product
		});
	}
	
	listByProduct(product: bigint, offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(ProductPrices, {
			product: product
		}, {
			limit: limit,
			offset: offset,
			orderBy: { product: "ASC", priceType: "ASC" },
		});
	}
	
	listAll(offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(ProductPrices, { }, {
			limit: limit,
			offset: offset,
			orderBy: { product: "ASC", priceType: "ASC" },
		});
	}
	
	findAll(emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(ProductPrices, { }, {
			orderBy: { product: "ASC", priceType: "ASC" },
		});
	}
	
	
}