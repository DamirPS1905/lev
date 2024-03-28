import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Companies } from './Companies';
import { Units } from './Units';

@Entity()
export class UnitGroups {

  @PrimaryKey()
  id!: number;

  @Property()
  title!: string;

  @ManyToOne({ entity: () => Companies, fieldName: 'company', nullable: true })
  company?: Companies;

  @Property({ columnType: 'text', nullable: true })
  description?: string;

  @ManyToOne({ entity: () => Units, fieldName: 'base', deleteRule: 'set null', nullable: true })
  base?: Units;

}
