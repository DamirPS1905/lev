import { Entity, type Hidden, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Companies } from './Companies';
import { UnitGroups } from './UnitGroups';

@Entity()
export class Units {

  @PrimaryKey()
  id!: number;

  @ManyToOne({ entity: () => Companies, fieldName: 'company', nullable: true, hidden: true })
  company?: Companies & Hidden;

  @Property()
  title!: string;

  @Property()
  abbr!: string;

  @ManyToOne({ entity: () => UnitGroups, fieldName: 'group', deleteRule: 'cascade' })
  group!: UnitGroups;

  @Property({ columnType: 'numeric(10,0)' })
  add!: string;

  @Property({ columnType: 'numeric(10,0)' })
  factor!: string;

}
