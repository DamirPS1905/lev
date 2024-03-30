import { Entity, type Hidden, OneToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Companies } from './Companies';

@Entity()
export class Catalogs {

  @PrimaryKey()
  id!: number;

  @Property()
  title!: string;

  @OneToOne({ entity: () => Companies, fieldName: 'company', hidden: true, unique: 'catalogs_company_title_uind' })
  company!: Companies & Hidden;

}
