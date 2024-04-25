import { CatalogProductOffers } from './../../entities/CatalogProductOffers';
import { CatalogProducts } from './../../entities/CatalogProducts';
import { PoRelationValues } from './../../entities/PoRelationValues';
import { CreatePoRelationValueDto } from './../dtos/create-po-relation-value.dto';
import { GenPoRelationValuesService } from './gen/po-relation-values.service';
import { EntityManager, wrap } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class PoRelationValuesService extends GenPoRelationValuesService {
	
  @Cron('23 */2 * * *')
	async sanitize(){
		const qu = `DELETE FROM public.po_relation_values 
								WHERE "changed_at" < CURRENT_TIMESTAMP - INTERVAL '1 week'
									AND "deleted"`;
		await this.getEm().getConnection().execute(qu);
	}
	
	state(dto: CreatePoRelationValueDto, emt: EntityManager = null){
		return this.getEm(emt).upsert(PoRelationValues, dto);
	}
	
	async removeByRelationAndSourceAndTarget(relation: number, source: bigint, target: bigint, emt: EntityManager = null) {
		const em = this.getEm(emt);
		const ref = em.getReference(PoRelationValues, [relation, source, target]);
		ref.deleted = true;
		await em.flush();
	}
	
	async getAllTargets(relation: number, source: bigint, emt: EntityManager = null){
		return await this.getEm(emt)
			.createQueryBuilder(CatalogProductOffers, 'p')
		  .select(['p.*'])
		  .join('p.poRelationValuesByTarget', 'r')
		  .where({'r.source': source, 'r.relation': relation, 'p.deleted': false })
		  .getResult();
	}
	
	async getAllSources(relation: number, target: bigint, emt: EntityManager = null){
		return await this.getEm(emt)
			.createQueryBuilder(CatalogProducts, 'p')
		  .select(['p.*'])
		  .join('p.poRelationValuesBySource', 'r')
		  .where({'r.target': target, 'r.relation': relation, 'p.deleted': false })
		  .getResult();
	}
	
}