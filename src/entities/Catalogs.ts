import { Entity, type Hidden, OneToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Companies } from './Companies';
import { PropertyTypes } from './PropertyTypes';

@Entity()
export class Catalogs {

  @PrimaryKey()
  id!: number;

  @Property()
  title!: string;

  @OneToOne({ entity: () => Companies, fieldName: 'company', hidden: true, unique: 'catalogs_company_title_uind' })
  company!: Companies & Hidden;

  @OneToOne({ entity: () => PropertyTypes, mappedBy: 'catalog' })
  catalogInverse?: PropertyTypes;

}
