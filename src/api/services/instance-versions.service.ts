import { GenInstanceVersionsService } from './gen/instance-versions.service';
import { Injectable } from '@nestjs/common';
import { EntityManager, wrap } from '@mikro-orm/postgresql';
import { InstanceVersions } from './../../entities/InstanceVersions';

@Injectable()
export class InstanceVersionsService extends GenInstanceVersionsService {
	
	listByCompany(company: number, offset: number, limit: number, emt: EntityManager = null) {
		const em = emt || this.em.fork();
		return em.find(InstanceVersions, {
				company: company
			}, {
			limit: limit,
			offset: offset,
			orderBy: { version: "ASC" },
		});
	}
	
}