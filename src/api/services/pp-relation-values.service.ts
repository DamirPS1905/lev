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
	
	state(dto: CreatePpRelationValueDto, emt: EntityManager = null){
		return this.getEm(emt).upsert(PpRelationValues, dto);
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
		  .where({'r.source': source, 'r.relation': relation, 'p.deleted': false })
		  .getResult();
	}
	
	async getAllSources(relation: number, target: bigint, emt: EntityManager = null){
		return await this.getEm(emt)
			.createQueryBuilder(CatalogProducts, 'p')
		  .select(['p.*'])
		  .join('p.ppRelationValuesBySource', 'r')
		  .where({'r.target': target, 'r.relation': relation, 'p.deleted': false })
		  .getResult();
	}
	
}