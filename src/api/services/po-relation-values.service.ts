import { GenPoRelationValuesService } from './gen/po-relation-values.service';
import { Injectable } from '@nestjs/common';
import { PoRelationValues } from './../../entities/PoRelationValues';
import { EntityManager, wrap } from '@mikro-orm/postgresql';
import { CatalogProductOffers } from './../../entities/CatalogProductOffers';
import { CatalogProducts } from './../../entities/CatalogProducts';

@Injectable()
export class PoRelationValuesService extends GenPoRelationValuesService {
	
	removeByRelationAndSourceAndTarget(relation: number, source: bigint, target: bigint, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.remove(em.getReference(PoRelationValues, [relation, source, target])).flush();
	}
	
	async getAllTargets(relation: number, source: bigint, emt: EntityManager = null){
		return await this.getEm(emt)
			.createQueryBuilder(CatalogProductOffers, 'p')
		  .select(['p.*'])
		  .join('p.poRelationValuesByTarget', 'r')
		  .where({'r.source': source, 'r.relation': relation })
		  .getResult();
	}
	
	async getAllSources(relation: number, target: bigint, emt: EntityManager = null){
		return await this.getEm(emt)
			.createQueryBuilder(CatalogProducts, 'p')
		  .select(['p.*'])
		  .join('p.poRelationValuesBySource', 'r')
		  .where({'r.target': target, 'r.relation': relation })
		  .getResult();
	}
	
}