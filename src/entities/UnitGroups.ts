import { Entity, type Hidden, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Companies } from './Companies';
import { Units } from './Units';

@Entity()
export class UnitGroups {

  @PrimaryKey()
  id!: number;

  @Property()
  title!: string;

  @ManyToOne({ entity: () => Companies, fieldName: 'company', nullable: true, hidden: true })
  company?: Companies & Hidden;

  @Property({ columnType: 'text', nullable: true })
  description?: string;

  @ManyToOne({ entity: () => Units, fieldName: 'base', deleteRule: 'set null', nullable: true })
  base?: Units;

}
