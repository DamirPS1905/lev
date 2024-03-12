import { Entity, ManyToOne, OneToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { CatalogBrands } from './CatalogBrands';
import { CatalogTypes } from './CatalogTypes';
import { Catalogs } from './Catalogs';

@Entity()
export class CatalogProducts {

  @PrimaryKey()
  id!: bigint;

  @OneToOne({ entity: () => Catalogs, fieldName: 'catalog', unique: 'catalog_products_catalog_title_uind' })
  catalog!: Catalogs;

  @ManyToOne({ entity: () => CatalogTypes, fieldName: 'type' })
  type!: CatalogTypes;

  @ManyToOne({ entity: () => CatalogBrands, fieldName: 'brand' })
  brand!: CatalogBrands;

  @Property()
  title!: string;

  @Property({ length: 6 })
  created!: Date;

}
