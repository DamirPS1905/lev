import { Entity, type Hidden, ManyToOne, OneToOne, type Opt, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { Companies } from './Companies';
import { UnitGroups } from './UnitGroups';

@Entity()
@Unique({ name: 'units_group_company_abbr_uind', expression: 'CREATE UNIQUE INDEX units_group_company_abbr_uind ON public.units USING btree ("group", company, abbr) WHERE (company IS NOT NULL)' })
@Unique({ name: 'units_group_company_title_uind', expression: 'CREATE UNIQUE INDEX units_group_company_title_uind ON public.units USING btree ("group", company, title) WHERE (company IS NOT NULL)' })
@Unique({ name: 'units_group_title_cuind', expression: 'CREATE UNIQUE INDEX units_group_title_cuind ON public.units USING btree ("group", title) WHERE (company IS NULL)' })
export class Units {

  @PrimaryKey()
  id!: number;

  @ManyToOne({ entity: () => Companies, fieldName: 'company', nullable: true, hidden: true })
  company?: Companies & Hidden;

  @Property()
  title!: string;

  @Property()
  abbr!: string;

  @OneToOne({ entity: () => UnitGroups, fieldName: 'group', deleteRule: 'cascade', unique: 'units_group_abbr_cuind' })
  group!: UnitGroups;

  @Property({ type: 'number', columnType: 'double precision' })
  add: number & Opt = 0;

  @Property({ type: 'number', columnType: 'double precision' })
  factor: number & Opt = 1;

}
