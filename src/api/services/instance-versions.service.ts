import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { InstanceVersions } from './../../entities/InstanceVersions';
import { GenInstanceVersionsService } from './gen/instance-versions.service';

@Injectable()
export class InstanceVersionsService extends GenInstanceVersionsService {
  async newByCompanyAndVersion(company: number, version: bigint, limit: number, emt: EntityManager = null) {
    return await this.getEm(emt)
      .createQueryBuilder(InstanceVersions, 'v')
      .select([`v.version`, 'v.instance_type as type', 'v.instance', 'v.deleted'])
      .where({ 'v.company': company, 'v.version': { $gt: version } })
      .orderBy({ version: 'ASC' })
      .limit(limit)
      .execute();
  }

  async upVersion(company: number, catalog: number, instanceType: number, instance: bigint, emt: EntityManager = null) {
    const em = this.getEm(emt),
      version = (await em.getConnection().execute(`SELECT nextval('versions_seq')::int8 as res`))[0].res;
    return await em.upsert(InstanceVersions, {
      company: company,
      catalog: catalog,
      instanceType: instanceType,
      instance: instance,
      version: version,
    });
  }

  async upDeleted(company: number, catalog: number, instanceType: number, instance: bigint, emt: EntityManager = null) {
    const em = this.getEm(emt),
      version = (await em.getConnection().execute(`SELECT nextval('versions_seq')::int8 as res`))[0].res;
    return await em.upsert(InstanceVersions, {
      company: company,
      catalog: catalog,
      instanceType: instanceType,
      instance: instance,
      version: version,
      deleted: true,
    });
  }
  async listByCompany(company: number, offset: number, limit: number, emt: EntityManager = null) {}
}
