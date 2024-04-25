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
	
	async findNewByRelation(relation: number, from: bigint, limit: number, emt: EntityManager = null) {
		return await this.getEm(emt)
			.createQueryBuilder(PoRelationValues, 'pp')
		  .select(['*'])
		  .where({'relation': relation, 'version': {$gt: from} })
		  .orderBy({'version': "ASC" })
		  .limit(limit)
		  .getResult();
	}
	
	async state(dto: CreatePoRelationValueDto, emt: EntityManager = null){
		const qu = `insert into "po_relation_values" ("deleted", "relation", "source", "target")
								values (?, ?, ?, ?) 
								on conflict ("relation", "source", "target") 
								do update set "deleted" = excluded."deleted"`;
		await this.getEm(emt).getConnection().execute(qu, [dto.deleted, dto.relation, dto.source, dto.target], 'run');
		//wtf: return this.getEm(emt).upsert(PoRelationValues, dto);
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
		  .where({'r.source': source, 'r.relation': relation, 'r.deleted': false })
		  .getResult();
	}
	
	async getAllSources(relation: number, target: bigint, emt: EntityManager = null){
		return await this.getEm(emt)
			.createQueryBuilder(CatalogProducts, 'p')
		  .select(['p.*'])
		  .join('p.poRelationValuesBySource', 'r')
		  .where({'r.target': target, 'r.relation': relation, 'r.deleted': false })
		  .getResult();
	}
	
}