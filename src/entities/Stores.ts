import { Entity, OneToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Companies } from './Companies';

@Entity()
export class Stores {

  @PrimaryKey()
  id!: number;

  @OneToOne({ entity: () => Companies, fieldName: 'company', unique: 'stores_company_title_uind' })
  company!: Companies;

  @Property()
  title!: string;

  @Property({ nullable: true })
  address?: string;

  @Property({ columnType: 'numeric(10,0)', nullable: true })
  geoLat?: string;

  @Property({ columnType: 'numeric(10,0)', nullable: true })
  geoLong?: string;

}
