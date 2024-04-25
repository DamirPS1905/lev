import { CatalogProductOffers } from './../../entities/CatalogProductOffers';
import { CatalogProducts } from './../../entities/CatalogProducts';
import { OpRelationValues } from './../../entities/OpRelationValues';
import { CreateOpRelationValueDto } from './../dtos/create-op-relation-value.dto';
import { GenOpRelationValuesService } from './gen/op-relation-values.service';
import { EntityManager, wrap } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class OpRelationValuesService extends GenOpRelationValuesService {
	
  @Cron('28 */2 * * *')
	async sanitize(){
		const qu = `DELETE FROM public.op_relation_values 
								WHERE "changed_at" < CURRENT_TIMESTAMP - INTERVAL '1 week'
									AND "deleted"`;
		await this.getEm().getConnection().execute(qu);
	}
	
	state(dto: CreateOpRelationValueDto, emt: EntityManager = null){
		return this.getEm(emt).upsert(OpRelationValues, dto);
	}
	
	async removeByRelationAndSourceAndTarget(relation: number, source: bigint, target: bigint, emt: EntityManager = null) {
		const em = this.getEm(emt);
		const ref = em.getReference(OpRelationValues, [relation, source, target]);
		ref.deleted = true;
		await em.flush();
	}
	
	async getAllTargets(relation: number, source: bigint, emt: EntityManager = null){
		return await this.getEm(emt)
			.createQueryBuilder(CatalogProducts, 'p')
		  .select(['p.*'])
		  .join('p.opRelationValuesByTarget', 'r')
		  .where({'r.source': source, 'r.relation': relation, 'p.deleted': false })
		  .getResult();
	}
	
	async getAllSources(relation: number, target: bigint, emt: EntityManager = null){
		return await this.getEm(emt)
			.createQueryBuilder(CatalogProductOffers, 'p')
		  .select(['p.*'])
		  .join('p.opRelationValuesBySource', 'r')
		  .where({'r.target': target, 'r.relation': relation, 'p.deleted': false })
		  .getResult();
	}
	
}