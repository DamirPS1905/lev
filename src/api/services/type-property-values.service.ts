import { GenTypePropertyValuesService } from './gen/type-property-values.service'
import { Injectable } from '@nestjs/common'
import { TypePropertyValues } from './../../entities/TypePropertyValues'
import { EntityManager } from '@mikro-orm/postgresql'
import { IMetatypeVauesService } from './interface/i-metatype-values.service'

@Injectable()
export class TypePropertyValuesService extends GenTypePropertyValuesService implements IMetatypeVauesService {
	
	findAllByInstanceAndProperty(instance: number, property: number, emt: EntityManager = null) {
		return this.getEm(emt).find(TypePropertyValues, {
			property: property,
			instance: instance
		});
	}
	
	async readValuesByInstanceAndProperty(instance: number, property: number, emt: EntityManager = null){
		const conn = this.getEm(emt).getConnection(),
					qu = `SELECT pv.value 
								FROM 
									type_property_values tpv 
									JOIN property_values pv ON pv.value_key = tpv.value
								WHERE tpv."instance" =${instance} AND tpv.property =${property}
								ORDER BY "order" ASC`;
		return await conn.execute(qu);
	}
	
	async readValuesByInstance(instance: number, emt: EntityManager = null){
		const conn = this.getEm(emt).getConnection(),
					qu = `SELECT tpv.property, pv.value 
								FROM 
									type_property_values tpv 
									JOIN property_values pv ON pv.value_key = tpv.value
								WHERE tpv."instance" =${instance}
								ORDER BY property ASC, "order" ASC`;
		return await conn.execute(qu);
	}
	
	async readValueByInstanceAndProperty(instance: number, property: number, emt: EntityManager = null){
		const conn = this.getEm(emt).getConnection(),
					qu = `SELECT pv.value 
								FROM 
									type_property_values tpv 
									JOIN property_values pv ON pv.value_key = tpv.value
								WHERE tpv."instance"=${instance} AND tpv.property=${property} AND tpv."order"=0`;
		const list = await conn.execute(qu);
		if(list.length>0) return list[0];
		return null;
	}
	
}