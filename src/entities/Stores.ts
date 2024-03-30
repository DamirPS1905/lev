import { Entity, type Hidden, OneToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Companies } from './Companies';

@Entity()
export class Stores {

  @PrimaryKey()
  id!: number;

  @OneToOne({ entity: () => Companies, fieldName: 'company', hidden: true, unique: 'stores_company_title_uind' })
  company!: Companies & Hidden;

  @Property()
  title!: string;

  @Property({ nullable: true })
  address?: string;

  @Property({ columnType: 'numeric(10,0)', nullable: true })
  geoLat?: string;

  @Property({ columnType: 'numeric(10,0)', nullable: true })
  geoLong?: string;

}
