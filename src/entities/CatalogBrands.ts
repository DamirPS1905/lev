import { Collection, Entity, OneToMany, OneToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { BrandPropertyValues } from './BrandPropertyValues';
import { CatalogProducts } from './CatalogProducts';
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

  @Property({ columnType: 'jsonb', nullable: true })
  logo?: any;

  @OneToMany({ entity: () => BrandPropertyValues, mappedBy: 'instance' })
  instanceInverse = new Collection<BrandPropertyValues>(this);

  @OneToMany({ entity: () => CatalogProducts, mappedBy: 'brand' })
  brandInverse = new Collection<CatalogProducts>(this);

}
