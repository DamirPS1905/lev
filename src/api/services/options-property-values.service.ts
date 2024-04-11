import { GenOptionsPropertyValuesService } from './gen/options-property-values.service';
import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql'
import { PropertyValues } from './../../entities/PropertyValues'

@Injectable()
export class OptionsPropertyValuesService extends GenOptionsPropertyValuesService {
	
	async readAllByProperty(property: number, offset: number, limit: number, emt: EntityManager = null){
		const em = this.getEm(emt),
					conn = em.getConnection(),
					qu = `SELECT pv.*
								FROM options_property_values opv  
								JOIN property_values pv ON pv.value_key=opv.value
								WHERE opv.property=${property}
								ORDER BY value_key ASC
								LIMIT ${limit} OFFSET ${offset}`;
		return await conn.execute<PropertyValues[]>(qu);
	}
	
}