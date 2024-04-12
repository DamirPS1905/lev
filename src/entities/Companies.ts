import { Collection, Entity, OneToMany, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { Users } from './Users';

@Entity()
export class Companies {

  @PrimaryKey()
  id!: number;

  @Unique({ name: 'companies_title_uind' })
  @Property()
  title!: string;

  @OneToMany({ entity: () => Users, mappedBy: 'company' })
  companyInverse = new Collection<Users>(this);

}
