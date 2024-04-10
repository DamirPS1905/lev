import { GenPropertyInTypesService } from './gen/property-in-types.service'
import { Injectable } from '@nestjs/common'
import { EntityManager, wrap } from '@mikro-orm/postgresql'
import { PropertyInTypes } from './../../entities/PropertyInTypes'

@Injectable()
export class PropertyInTypesService extends GenPropertyInTypesService {
	
	async getChildsWithPropertyByType(property: number, parent: number, emt: EntityManager = null){
		const em = this.getEm(emt),
					conn = em.getConnection(),
					qu = `SELECT pit.*
								FROM catalog_types_overload cto
								JOIN catalog_types ct ON cto.child=ct.id
								JOIN property_in_types pit ON pit."type"=ct.id 
								WHERE cto.parent=${parent} AND pit.property=${property}`;
		return (await conn.execute(qu)).map(p => em.map(PropertyInTypes, p) as PropertyInTypes);
	}
	
	async getParentsWithPropertyByType(property: number, child: number, emt: EntityManager = null){
		const em = this.getEm(emt),
					conn = em.getConnection(),
					qu = `SELECT pit.*
								FROM catalog_types_overload cto
								JOIN catalog_types ct ON cto.parent=ct.id
								JOIN property_in_types pit ON pit."type"=ct.id 
								WHERE cto.child=${child} AND pit.property=${property}`;
		return (await conn.execute(qu)).map(p => em.map(PropertyInTypes, p) as PropertyInTypes);
	}
	
}