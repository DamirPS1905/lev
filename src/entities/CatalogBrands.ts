import { BrandPropertyValues } from './BrandPropertyValues';
import { CatalogBrandCollections } from './CatalogBrandCollections';
import { CatalogProducts } from './CatalogProducts';
import { Catalogs } from './Catalogs';
import { Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property, type Hidden } from '@mikro-orm/core';

@Entity()
export class CatalogBrands {

  @PrimaryKey()
  id!: number;

  @ManyToOne({ entity: () => Catalogs, fieldName: 'catalog', unique: 'catalog_brands_catalog_title_uind' })
  catalog!: Catalogs;

  @Property()
  title!: string;

  @Property({ columnType: 'text', nullable: true })
  description?: string;

  @Property({ nullable: true })
  image?: string;

	// gen - begin
	
	@OneToMany({ entity: () => CatalogProducts, mappedBy: 'brand', hidden: true })
	catalogProductsByBrand: Collection<CatalogProducts> & Hidden = new Collection<CatalogProducts>(this);
	
	@OneToMany({ entity: () => BrandPropertyValues, mappedBy: 'instance', hidden: true })
	brandPropertyValuesByInstance: Collection<BrandPropertyValues> & Hidden = new Collection<BrandPropertyValues>(this);
	
	@OneToMany({ entity: () => CatalogBrandCollections, mappedBy: 'brand', hidden: true })
	catalogBrandCollectionsByBrand: Collection<CatalogBrandCollections> & Hidden = new Collection<CatalogBrandCollections>(this);
	
	// gen - end
}
