import { GenPpRelationValuesService } from './gen/pp-relation-values.service';
import { Injectable } from '@nestjs/common';
import { PpRelationValues } from './../../entities/PpRelationValues';
import { EntityManager, wrap } from '@mikro-orm/postgresql';
import { CatalogProducts } from './../../entities/CatalogProducts';

@Injectable()
export class PpRelationValuesService extends GenPpRelationValuesService {
	
	removeByRelationAndSourceAndTarget(relation: number, source: bigint, target: bigint, emt: EntityManager = null) {
		const em = this.getEm(emt);
		return em.remove(em.getReference(PpRelationValues, [relation, source, target])).flush();
	}
	
	async getAllTargets(relation: number, source: bigint, emt: EntityManager = null){
		return await this.getEm(emt)
			.createQueryBuilder(CatalogProducts, 'p')
		  .select(['p.*'])
		  .join('p.ppRelationValuesByTarget', 'r')
		  .where({'r.source': source, 'r.relation': relation })
		  .getResult();
	}
	
	async getAllSources(relation: number, target: bigint, emt: EntityManager = null){
		return await this.getEm(emt)
			.createQueryBuilder(CatalogProducts, 'p')
		  .select(['p.*'])
		  .join('p.ppRelationValuesBySource', 'r')
		  .where({'r.target': target, 'r.relation': relation })
		  .getResult();
	}
	
}