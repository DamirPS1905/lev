import { GenOfferPropertyValuesService } from './gen/offer-property-values.service';
import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql'
import { OfferPropertyValues } from './../../entities/OfferPropertyValues'
import { IMetatypeVauesService } from './interface/i-metatype-values.service'

@Injectable()
export class OfferPropertyValuesService extends GenOfferPropertyValuesService implements IMetatypeVauesService<bigint> {
	
	findAllByInstanceAndProperty(offer: bigint, property: number, emt: EntityManager = null) {
		return this.getEm(emt).find(OfferPropertyValues, {
			property: property,
			offer: offer
		});
	}
	
	findByInstanceAndPropertyAndOrder(offer: bigint, property: number, order: number, emt: EntityManager = null) {
		return this.findByOfferAndPropertyAndOrder(offer, property, order);
	}
	
	async readValuesByInstance(offer: bigint, emt: EntityManager = null){
		const conn = this.getEm(emt).getConnection(),
					qu = `SELECT opv.property, p.type, pv.value, p.multiple
								FROM 
									offer_property_values opv 
									JOIN property_values pv ON pv.value_key = opv.value
									JOIN catalog_properties p ON p.id = opv.property
								WHERE opv.offer =${offer}
								ORDER BY property ASC, "order" ASC`;
		return await conn.execute(qu);
	}
	
	async readValuesByInstanceAndProperty(offer: bigint, property: number, emt: EntityManager = null){
		const conn = this.getEm(emt).getConnection(),
					qu = `SELECT pv.value 
								FROM 
									offer_property_values opv 
									JOIN property_values pv ON pv.value_key = opv.value
								WHERE opv.offer =${offer} AND opv.property =${property}
								ORDER BY opv."order" ASC`;
		return await conn.execute(qu);
	}
	
	async readValueByInstanceAndProperty(offer: bigint, property: number, emt: EntityManager = null){
		const conn = this.getEm(emt).getConnection(),
					qu = `SELECT pv.value 
								FROM 
									offer_property_values opv 
									JOIN property_values pv ON pv.value_key = opv.value
								WHERE opv."offer"=${offer} AND opv.property=${property} AND opv."order"=0`;
		const list = await conn.execute(qu);
		if(list.length>0) return list[0];
		return null;
	}
	
	async removeExtraByInstanceAndPropertyAndMaxOrder(offer: bigint, property: number, maxOrder: number, andValues: boolean, emt: EntityManager = null){
		const conn = this.getEm(emt).getConnection();
		if(andValues){
			const qu = `DELETE FROM property_values pv
									USING offer_property_values opv 
									WHERE pv.value_key = opv.value AND opv.offer=${offer} AND opv.property=${property} AND opv."order">=${maxOrder}`;
			await conn.execute(qu);
		}
		const qu = `DELETE FROM offer_property_values opv
								WHERE opv.offer=${offer} AND opv.property=${property} AND opv."order">=${maxOrder}`;
		await conn.execute(qu);
	}
	
}