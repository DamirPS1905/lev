import { CatalogProducts } from './../../entities/CatalogProducts';
import { PpRelationValues } from './../../entities/PpRelationValues';
import { CreatePpRelationValueDto } from './../dtos/create-pp-relation-value.dto';
import { GenPpRelationValuesService } from './gen/pp-relation-values.service';
import { EntityManager, wrap } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class PpRelationValuesService extends GenPpRelationValuesService {
	
  @Cron('20 */2 * * *')
	async sanitize(){
		const qu = `DELETE FROM public.pp_relation_values 
								WHERE "changed_at" < CURRENT_TIMESTAMP - INTERVAL '1 week'
									AND "deleted"`;
		await this.getEm().getConnection().execute(qu);
	}
	
	async findNewByRelation(relation: number, from: bigint, limit: number, emt: EntityManager = null) {
		return await this.getEm(emt)
			.createQueryBuilder(PpRelationValues, 'pp')
		  .select(['*'])
		  .where({'relation': relation, 'version': {$gt: from} })
		  .orderBy({'version': "ASC" })
		  .limit(limit)
		  .getResult();
	}
	
	async state(dto: CreatePpRelationValueDto, emt: EntityManager = null){
		const qu = `insert into "pp_relation_values" ("deleted", "relation", "source", "target")
								values (?, ?, ?, ?) 
								on conflict ("relation", "source", "target") 
								do update set "deleted" = excluded."deleted"`;
		await this.getEm(emt).getConnection().execute(qu, [dto.deleted, dto.relation, dto.source, dto.target], 'run');
		//wtf: await this.getEm(emt).upsert(PpRelationValues, dto);
	}
	
	async removeByRelationAndSourceAndTarget(relation: number, source: bigint, target: bigint, emt: EntityManager = null) {
		const em = this.getEm(emt);
		const ref = em.getReference(PpRelationValues, [relation, source, target]);
		ref.deleted = true;
		await em.flush();
	}
	
	async getAllTargets(relation: number, source: bigint, emt: EntityManager = null){
		return await this.getEm(emt)
			.createQueryBuilder(CatalogProducts, 'p')
		  .select(['p.*'])
		  .join('p.ppRelationValuesByTarget', 'r')
		  .where({'r.source': source, 'r.relation': relation, 'r.deleted': false })
		  .getResult();
	}
	
	async getAllSources(relation: number, target: bigint, emt: EntityManager = null){
		return await this.getEm(emt)
			.createQueryBuilder(CatalogProducts, 'p')
		  .select(['p.*'])
		  .join('p.ppRelationValuesBySource', 'r')
		  .where({'r.target': target, 'r.relation': relation, 'r.deleted': false })
		  .getResult();
	}
	
}