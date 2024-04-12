import { Collection, Entity, ManyToOne, OneToMany, OneToOne, type Opt, PrimaryKey, Property } from '@mikro-orm/core';
import { CatalogBrands } from './CatalogBrands';
import { CatalogTypes } from './CatalogTypes';
import { Catalogs } from './Catalogs';
import { ProductPropertyValues } from './ProductPropertyValues';

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

  @Property({ type: 'Date', length: 6, defaultRaw: `CURRENT_TIMESTAMP` })
  created!: Date & Opt;

  @OneToMany({ entity: () => ProductPropertyValues, mappedBy: 'product' })
  productInverse = new Collection<ProductPropertyValues>(this);

}
