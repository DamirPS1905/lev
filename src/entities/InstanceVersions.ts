import { Entity, type Hidden, Index, type Opt, PrimaryKey, PrimaryKeyProp, Property } from '@mikro-orm/core';

@Entity()
@Index({ name: 'instance_versions_company_version_ind', properties: ['company', 'version'] })
export class InstanceVersions {

  [PrimaryKeyProp]?: ['instanceType', 'instance'];

  @Property({ type: 'number', hidden: true })
  company!: number & Hidden;

  @Property()
  catalog!: number;

  @PrimaryKey()
  instanceType!: number;

  @PrimaryKey()
  instance!: bigint;

  @Property()
  version!: bigint;

  @Property({ type: 'boolean' })
  deleted: boolean & Opt = false;

}
