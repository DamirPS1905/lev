import { Entity, OneToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Catalogs } from './Catalogs';

@Entity()
export class CatalogBrands {

  @PrimaryKey()
  id!: number;

  @OneToOne({ entity: () => Catalogs, fieldName: 'catalog', unique: 'catalog_brands_catalog_title_uind' })
  catalog!: Catalogs;

  @Property()
  title!: string;

  @Property({ columnType: 'text', nullable: true })
  description?: string;

  @Property({ nullable: true })
  logo?: string;

}
