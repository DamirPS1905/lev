import { GenUnitsService } from './gen/units.service'
import { Injectable } from '@nestjs/common'
import { Units } from './../../entities/Units'
import { EntityManager } from '@mikro-orm/postgresql'

@Injectable()
export class UnitsService extends GenUnitsService {
	
	findAllByGroupAndCompany(group: number, company: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(Units, {
			group: group,
			$or: [
				{ company: company },
				{ company: { $eq: null } }
			]
		});
	}
	
	listByGroupAndCompany(group: number, company: number, offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(Units, {
			group: group,
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

	
	findCommonByGroupAndTitle(group: number, title: string, emt: EntityManager = null) {
		return this.getEm(emt).findOne(Units, {
			group: group,
			title: title,
			company: { $eq: null }
		});
  }

	findCommonByGroupAndAbbr(group: number, abbr: string, emt: EntityManager = null) {
		return this.getEm(emt).findOne(Units, {
			group: group,
			abbr: abbr,
			company: { $eq: null }
		});
  }

	findByGroupAndCompanyAndTitle(group: number, company: number, title: string, emt: EntityManager = null) {
		return this.getEm(emt).findOne(Units, {
			group: group,
			title: title,
			company: company
		});
  }

	findByGroupAndCompanyAndAbbr(group: number, company: number, abbr: string, emt: EntityManager = null) {
		return this.getEm(emt).findOne(Units, {
			group: group,
			abbr: abbr,
			company: company
		});
  }
	
}