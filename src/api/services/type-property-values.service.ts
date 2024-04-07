import { GenTypePropertyValuesService } from './gen/type-property-values.service'
import { Injectable } from '@nestjs/common'
import { TypePropertyValues } from './../../entities/TypePropertyValues'
import { EntityManager } from '@mikro-orm/postgresql'

@Injectable()
export class TypePropertyValuesService extends GenTypePropertyValuesService {
	
	findAllByTypeAndProperty(type: number, property: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(TypePropertyValues, {
			property: property,
			type: type
		});
	}
	
	async readValuesByTypeAndProperty(type: number, property: number, emt: EntityManager = null){
		const em = this.getEm(emt),
					conn = em.getConnection(),
					qu = `SELECT pv.value 
								FROM 
									type_property_values tpv 
									JOIN property_values pv ON pv.value_key = tpv.value
								WHERE tpv."type" =${type} AND tpv.property =${property}
								ORDER BY "order" ASC`;
		return await conn.execute(qu);
	}
	
	async readValueByTypeAndProperty(type: number, property: number, emt: EntityManager = null){
		const em = this.getEm(emt),
					conn = em.getConnection(),
					qu = `SELECT pv.value 
								FROM 
									type_property_values tpv 
									JOIN property_values pv ON pv.value_key = tpv.value
								WHERE tpv."type"=${type} AND tpv.property=${property} AND tpv."order"=0`;
		const list = await conn.execute(qu);
		if(list.length>0) return list[0];
		return null;
	}
	
}