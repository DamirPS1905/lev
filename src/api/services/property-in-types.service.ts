import { GenPropertyInTypesService } from './gen/property-in-types.service'
import { Injectable } from '@nestjs/common'
import { EntityManager, wrap } from '@mikro-orm/postgresql'
import { PropertyInTypes } from './../../entities/PropertyInTypes'
import { CatalogProperties } from './../../entities/CatalogProperties'
import { CreatePropertyInTypeDto } from './../dtos/create-property-in-type.dto'

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
	
	
	async findEveryByType(type: number, emt: EntityManager = null) {
		const conn = this.getEm(emt).getConnection(),
					qu = `SELECT cp.id, cp."catalog", cp.title, cp."type", cp.multiple, cp."options", pit.scheme 
								FROM catalog_types_overload cto 
								JOIN catalog_types ct ON cto.parent = ct.id
								JOIN property_in_types pit ON pit."type" =ct.id
								JOIN catalog_properties cp ON cp.id=pit.property 
								WHERE cto."child" =${type}`;
		return await conn.execute<CatalogProperties[]>(qu);
	}
	
	async prepearTypeTransfer(type: number, oldParent: number, newParent: number, emt: EntityManager = null){
		// 1. Get childs and self own properties which already exists in newParent
		let clean: PropertyInTypes[] = [], add: PropertyInTypes[]  = [];
		const em = this.getEm(emt),
					conn = em.getConnection(),
					ownProperties = (await em.createQueryBuilder(PropertyInTypes, 'pit')
					  .select(['pit.property'], true)
					  .join('pit.type', 'ct')
					  .join('ct.childInverse', 'cto')
					  .where({'cto.parent': type })
					  .execute()).map(p=>p.property.id);
		if(ownProperties.length>0){
			clean = await em.createQueryBuilder(PropertyInTypes, 'pit')
			  .select(['pit.*'])
			  .join('pit.type', 'ct')
			  .join('ct.parentInverse', 'cto')
			  .where({'cto.child': newParent, 'pit.property': { $in: ownProperties } })
			  .getResult();
		}
		// 2. Collect loosing properties
		const loosed = await em.createQueryBuilder(PropertyInTypes, 'pit')
		  .select(['pit.*'])
		  .join('pit.type', 'ct')
		  .join('ct.parentInverse', 'cto')
		  .where({'cto.child': oldParent })
		  .getResult();
		if(loosed.length>0){
			const lookUp = loosed.map(p => p.property.id),
						found = (await em.createQueryBuilder(PropertyInTypes, 'pit')
						  .select(['pit.property'])
						  .join('pit.type', 'ct')
						  .join('ct.parentInverse', 'cto')
						  .where({'cto.child': newParent, 'pit.property': { $in: lookUp } })
						  .execute()).map(p=>p.property.id);
			add = loosed.filter(lost => !found.includes(lost.property.id))
		}
		return [clean, add];
	}
	
	async applyTypeTranser(type: number, prepeared: PropertyInTypes[][], emt: EntityManager = null){
		const [clean, add] = prepeared;
		await this.getEm(emt).transactional(async (em) => {
			console.log(clean);
			em.remove(clean);
			for(let reborn of add){
				const cdto = new CreatePropertyInTypeDto();
				cdto.type = type;
				cdto.property = reborn.property.id;
				cdto.scheme = reborn.scheme;
				console.log(cdto);
				this.create(cdto, em);
			}
			em.flush();
		});
	}
	
}