import { GenPropertyInTypesService } from './gen/property-in-types.service'
import { Injectable } from '@nestjs/common'
import { EntityManager, wrap } from '@mikro-orm/postgresql'
import { PropertyInTypes } from './../../entities/PropertyInTypes'
import { CatalogProperties } from './../../entities/CatalogProperties'

@Injectable()
export class PropertyInTypesService extends GenPropertyInTypesService {
	
	async getChildsWithPropertyByType(property: number, parent: number, emt: EntityManager = null){
		const conn = this.getEm(emt).getConnection(),
					qu = `SELECT pit.*
								FROM catalog_types_overload cto
								JOIN catalog_types ct ON cto.child=ct.id
								JOIN property_in_types pit ON pit."type"=ct.id 
								WHERE cto.parent=${parent} AND pit.property=${property}`;
		return await conn.execute<PropertyInTypes[]>(qu);
	}
	
	async getParentsWithPropertyByType(property: number, child: number, emt: EntityManager = null){
		const conn = this.getEm(emt).getConnection(),
					qu = `SELECT pit.*
								FROM catalog_types_overload cto
								JOIN catalog_types ct ON cto.parent=ct.id
								JOIN property_in_types pit ON pit."type"=ct.id 
								WHERE cto.child=${child} AND pit.property=${property}`;
		return await conn.execute<PropertyInTypes[]>(qu);
	}
	
	async findOwnByType(type: number, emt: EntityManager = null) {
		const conn = this.getEm(emt).getConnection(),
					qu = `SELECT cp.id, cp."catalog", cp.title, cp."type", cp.multiple, cp."options", pit.scheme 
								FROM property_in_types pit
								JOIN catalog_properties cp ON cp.id=pit.property 
								WHERE pit."type" =${type}`;
		return await conn.execute<CatalogProperties[]>(qu);
	}
	
	async findInheritedByType(type: number, emt: EntityManager = null) {
		const conn = this.getEm(emt).getConnection(),
					qu = `SELECT cp.id, cp."catalog", cp.title, cp."type", cp.multiple, cp."options", pit.scheme 
								FROM catalog_types_overload cto 
								JOIN catalog_types ct ON cto.parent = ct.id
								JOIN property_in_types pit ON pit."type" =ct.id
								JOIN catalog_properties cp ON cp.id=pit.property 
								WHERE cto."child" =${type}`;
		return await conn.execute<CatalogProperties[]>(qu);
	}
	
	async findEveryByType(type: number, emt: EntityManager = null) {
		const list = await this.findInheritedByType(type, emt);
		list.push(...(await this.findOwnByType(type, emt)));
		return list;
	}
}