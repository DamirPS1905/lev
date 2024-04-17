import { GenOoRelationValuesService } from './gen/oo-relation-values.service';
import { Injectable } from '@nestjs/common';
import { OoRelationValues } from './../../entities/OoRelationValues';
import { EntityManager, wrap } from '@mikro-orm/postgresql';
import { CatalogProductOffers } from './../../entities/CatalogProductOffers';

@Injectable()
export class OoRelationValuesService extends GenOoRelationValuesService {
	
	removeByRelationAndSourceAndTarget(relation: number, source: bigint, target: bigint, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.remove(em.getReference(OoRelationValues, [relation, source, target])).flush();
	}
	
	async getAllTargets(relation: number, source: bigint, emt: EntityManager = null){
		return await this.getEm(emt)
			.createQueryBuilder(CatalogProductOffers, 'p')
		  .select(['p.*'])
		  .join('p.ooRelationValuesByTarget', 'r')
		  .where({'r.source': source, 'r.relation': relation })
		  .getResult();
	}
	
	async getAllSources(relation: number, target: bigint, emt: EntityManager = null){
		return await this.getEm(emt)
			.createQueryBuilder(CatalogProductOffers, 'p')
		  .select(['p.*'])
		  .join('p.ooRelationValuesBySource', 'r')
		  .where({'r.target': target, 'r.relation': relation })
		  .getResult();
	}
	
}