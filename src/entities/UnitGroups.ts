import { Companies } from './Companies';
import { Units } from './Units';
import { Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property, Unique, type Hidden } from '@mikro-orm/core';

@Entity()
@Unique({ name: 'unit_groups_title_cuind', expression: 'CREATE UNIQUE INDEX unit_groups_title_cuind ON public.unit_groups USING btree (title) WHERE (company IS NULL)' })
export class UnitGroups {

  @PrimaryKey()
  id!: number;

  @Unique({ name: 'unit_groups_title_cuind' })
  @Property()
  title!: string;

  @ManyToOne({ entity: () => Companies, fieldName: 'company', nullable: true, hidden: true, unique: 'unit_groups_company_title_uind' })
  company?: Companies & Hidden;

  @Property({ columnType: 'text', nullable: true })
  description?: string;

  @ManyToOne({ entity: () => Units, fieldName: 'base', deleteRule: 'set null', nullable: true })
  base?: Units;

	// gen - begin
	
	@OneToMany({ entity: () => Units, mappedBy: 'group' })
	unitsByGroup = new Collection<Units>(this);
	
	// gen - end
}
