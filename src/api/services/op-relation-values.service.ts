import { GenOpRelationValuesService } from './gen/op-relation-values.service';
import { Injectable } from '@nestjs/common';
import { OpRelationValues } from './../../entities/OpRelationValues';
import { EntityManager, wrap } from '@mikro-orm/postgresql';
import { CatalogProductOffers } from './../../entities/CatalogProductOffers';
import { CatalogProducts } from './../../entities/CatalogProducts';

@Injectable()
export class OpRelationValuesService extends GenOpRelationValuesService {
	
	removeByRelationAndSourceAndTarget(relation: number, source: bigint, target: bigint, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.remove(em.getReference(OpRelationValues, [relation, source, target])).flush();
	}
	
	async getAllTargets(relation: number, source: bigint, emt: EntityManager = null){
		return await this.getEm(emt)
			.createQueryBuilder(CatalogProducts, 'p')
		  .select(['p.*'])
		  .join('p.opRelationValuesByTarget', 'r')
		  .where({'r.source': source, 'r.relation': relation })
		  .getResult();
	}
	
	async getAllSources(relation: number, target: bigint, emt: EntityManager = null){
		return await this.getEm(emt)
			.createQueryBuilder(CatalogProductOffers, 'p')
		  .select(['p.*'])
		  .join('p.opRelationValuesBySource', 'r')
		  .where({'r.target': target, 'r.relation': relation })
		  .getResult();
	}
	
}