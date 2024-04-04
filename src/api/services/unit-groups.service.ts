import { GenUnitGroupsService } from './gen/unit-groups.service'
import { Injectable } from '@nestjs/common'
import { UnitGroups } from './../../entities/UnitGroups'
import { EntityManager } from '@mikro-orm/postgresql'

@Injectable()
export class UnitGroupsService extends GenUnitGroupsService {
	
	findAllByCompany(company: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(UnitGroups, {
			$or: [
				{ company: company },
				{ company: { $eq: null } }
			]
		});
	}
	
	listByCompany(company: number, offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(UnitGroups, {
			$or: [
				{ company: company },
				{ company: { $eq: null } }
			]
		}, {
			limit: limit,
			offset: offset,
			orderBy: { id: "ASC" },
		});
	}

	
	findCommonByTitle(title: string, emt: EntityManager = null) {
		return this.getEm(emt).findOne(UnitGroups, {
			title: title,
			company: { $eq: null }
		});
  }
/*
	findCommonByAbbr(abbr: string, emt: EntityManager = null) {
		return this.getEm(emt).findOne(UnitGroups, {
			abbr: abbr,
			company: { $eq: null }
		});
  }
*/
	findByCompanyAndTitle(company: number, title: string, emt: EntityManager = null) {
		return this.getEm(emt).findOne(UnitGroups, {
			title: title,
			company: company
		});
  }
/*
	async findByCompanyAndAbbr(company: number, abbr: string, emt: EntityManager = null) {
		return await this.getEm(emt).findOne(UnitGroups, {
			abbr: abbr,
			company: company
		});
  }
*/
	
}