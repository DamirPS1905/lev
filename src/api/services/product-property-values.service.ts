import { GenProductPropertyValuesService } from './gen/product-property-values.service';
import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql'
import { ProductPropertyValues } from './../../entities/ProductPropertyValues'
import { IMetatypeVauesService } from './interface/i-metatype-values.service'

@Injectable()
export class ProductPropertyValuesService extends GenProductPropertyValuesService implements IMetatypeVauesService<bigint> {
	
	findAllByInstanceAndProperty(product: bigint, property: number, emt: EntityManager = null) {
		return this.getEm(emt).find(ProductPropertyValues, {
			property: property,
			product: product
		});
	}
	
	findByInstanceAndPropertyAndOrder(product: bigint, property: number, order: number, emt: EntityManager = null) {
		return this.findByProductAndPropertyAndOrder(product, property, order);
	}
	
	async readValuesByInstance(product: bigint, emt: EntityManager = null){
		const conn = this.getEm(emt).getConnection(),
					qu = `SELECT ppv.property, pv.value, p.multiple
								FROM 
									product_property_values ppv 
									JOIN property_values pv ON pv.value_key = ppv.value
									JOIN catalog_properties p ON p.id = ppv.property
								WHERE ppv.product =${product}
								ORDER BY property ASC, "order" ASC`;
		return await conn.execute(qu);
	}
	
	async readValuesByInstanceAndProperty(product: bigint, property: number, emt: EntityManager = null){
		const conn = this.getEm(emt).getConnection(),
					qu = `SELECT pv.value 
								FROM 
									product_property_values ppv 
									JOIN property_values pv ON pv.value_key = ppv.value
								WHERE ppv.product =${product} AND ppv.property =${property}
								ORDER BY ppv."order" ASC`;
		return await conn.execute(qu);
	}
	
	async readValueByInstanceAndProperty(product: bigint, property: number, emt: EntityManager = null){
		const conn = this.getEm(emt).getConnection(),
					qu = `SELECT pv.value 
								FROM 
									product_property_values ppv 
									JOIN property_values pv ON pv.value_key = ppv.value
								WHERE ppv."product"=${product} AND ppv.property=${property} AND ppv."order"=0`;
		const list = await conn.execute(qu);
		if(list.length>0) return list[0];
		return null;
	}
	
	async removeExtraByInstanceAndPropertyAndMaxOrder(product: bigint, property: number, maxOrder: number, andValues: boolean, emt: EntityManager = null){
		const conn = this.getEm(emt).getConnection();
		if(andValues){
			const qu = `DELETE FROM property_values pv
									USING product_property_values ppv 
									WHERE pv.value_key = ppv.value AND ppv.product=${product} AND ppv.property=${property} AND ppv."order">=${maxOrder}`;
			await conn.execute(qu);
		}
		const qu = `DELETE FROM product_property_values ppv
								WHERE ppv.product=${product} AND ppv.property=${property} AND ppv."order">=${maxOrder}`;
		await conn.execute(qu);
	}
	
}