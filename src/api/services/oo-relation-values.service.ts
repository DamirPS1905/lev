import { CatalogProductOffers } from './../../entities/CatalogProductOffers';
import { OoRelationValues } from './../../entities/OoRelationValues';
import { CreateOoRelationValueDto } from './../dtos/create-oo-relation-value.dto';
import { GenOoRelationValuesService } from './gen/oo-relation-values.service';
import { EntityManager, wrap } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class OoRelationValuesService extends GenOoRelationValuesService {
	
  @Cron('18 */2 * * *')
	async sanitize(){
		const qu = `DELETE FROM public.oo_relation_values 
								WHERE "changed_at" < CURRENT_TIMESTAMP - INTERVAL '1 week'
									AND "deleted"`;
		await this.getEm().getConnection().execute(qu);
	}
	
	state(dto: CreateOoRelationValueDto, emt: EntityManager = null){
		return this.getEm(emt).upsert(OoRelationValues, dto);
	}
	
	async removeByRelationAndSourceAndTarget(relation: number, source: bigint, target: bigint, emt: EntityManager = null) {
		const em = this.getEm(emt);
		const ref = em.getReference(OoRelationValues, [relation, source, target]);
		ref.deleted = true;
		await em.flush();
	}
	
	async getAllTargets(relation: number, source: bigint, emt: EntityManager = null){
		return await this.getEm(emt)
			.createQueryBuilder(CatalogProductOffers, 'p')
		  .select(['p.*'])
		  .join('p.ooRelationValuesByTarget', 'r')
		  .where({'r.source': source, 'r.relation': relation, 'p.deleted': false })
		  .getResult();
	}
	
	async getAllSources(relation: number, target: bigint, emt: EntityManager = null){
		return await this.getEm(emt)
			.createQueryBuilder(CatalogProductOffers, 'p')
		  .select(['p.*'])
		  .join('p.ooRelationValuesBySource', 'r')
		  .where({'r.target': target, 'r.relation': relation, 'p.deleted': false })
		  .getResult();
	}
	
}