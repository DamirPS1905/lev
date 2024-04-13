import { GenPropertyInTypesService } from './gen/property-in-types.service'
import { Injectable } from '@nestjs/common'
import { EntityManager, wrap } from '@mikro-orm/postgresql'
import { PropertyInTypes } from './../../entities/PropertyInTypes'
import { CatalogProperties } from './../../entities/CatalogProperties'
import { CreatePropertyInTypeDto } from './../dtos/create-property-in-type.dto'

@Injectable()
export class PropertyInTypesService extends GenPropertyInTypesService {
	
	async getChildsWithPropertyByType(property: number, parent: number, emt: EntityManager = null){
		return await this.getEm(emt)
			.createQueryBuilder(PropertyInTypes, 'pit')
		  .select(['pit.*'])
		  .join('pit.type', 'ct')
		  .join('ct.catalogTypesOverloadByChild', 'cto')
		  .where({'cto.parent': parent, 'pit.property': property })
		  .getResult();
	}
	
	async getParentsWithPropertyByType(property: number, child: number, emt: EntityManager = null){
		return await this.getEm(emt)
			.createQueryBuilder(PropertyInTypes, 'pit')
		  .select(['pit.*'])
		  .join('pit.type', 'ct')
		  .join('ct.catalogTypesOverloadByParent', 'cto')
		  .where({'cto.child': child, 'pit.property': property })
		  .getResult();
	}
	
	async findOwnByType(type: number, emt: EntityManager = null) {
		return await this.getEm(emt)
			.createQueryBuilder(CatalogProperties, 'cp')
		  .select(['cp.id', 'cp.catalog', 'cp.title', 'cp.type', 'cp.multiple', 'cp.options', 'pit.scheme'])
		  .join('cp.propertyInTypesByProperty', 'pit')
		  .where({'pit.type': type })
		  .getResult();
	}
	
	
	async findEveryByType(type: number, emt: EntityManager = null) {
		return await this.getEm(emt)
			.createQueryBuilder(CatalogProperties, 'cp')
		  .select(['cp.id', 'cp.catalog', 'cp.title', 'cp.type', 'cp.multiple', 'cp.options', 'pit.scheme'])
		  .join('cp.propertyInTypesByProperty', 'pit')
		  .join('pit.type', 'ct')
		  .join('ct.catalogTypesOverloadByParent', 'cto')
		  .where({'cto.child': type })
		  .getResult();
	}
	
	async prepearTypeTransfer(type: number, oldParent: number, newParent: number, emt: EntityManager = null){
		// 1. Get childs and self own properties which already exists in newParent
		let clean: PropertyInTypes[] = [], add: PropertyInTypes[]  = [];
		const em = this.getEm(emt),
					conn = em.getConnection(),
					ownProperties = (await em.createQueryBuilder(PropertyInTypes, 'pit')
					  .select(['pit.property'], true)
					  .join('pit.type', 'ct')
					  .join('ct.catalogTypesOverloadByChild', 'cto')
					  .where({'cto.parent': type })
					  .execute()).map(p=>p.property.id);
		if(ownProperties.length>0){
			clean = await em.createQueryBuilder(PropertyInTypes, 'pit')
			  .select(['pit.*'])
			  .join('pit.type', 'ct')
			  .join('ct.catalogTypesOverloadByParent', 'cto')
			  .where({'cto.child': newParent, 'pit.property': { $in: ownProperties } })
			  .getResult();
		}
		// 2. Collect loosing properties
		const loosed = await em.createQueryBuilder(PropertyInTypes, 'pit')
		  .select(['pit.*'])
		  .join('pit.type', 'ct')
		  .join('ct.catalogTypesOverloadByParent', 'cto')
		  .where({'cto.child': oldParent })
		  .getResult();
		if(loosed.length>0){
			const lookUp = loosed.map(p => p.property.id),
						found = (await em.createQueryBuilder(PropertyInTypes, 'pit')
						  .select(['pit.property'])
						  .join('pit.type', 'ct')
						  .join('ct.catalogTypesOverloadByParent', 'cto')
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