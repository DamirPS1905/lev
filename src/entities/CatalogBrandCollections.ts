import { CatalogBrands } from './CatalogBrands';
import { CatalogProducts } from './CatalogProducts';
import { CollectionPropertyValues } from './CollectionPropertyValues';
import { Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property, type Hidden } from '@mikro-orm/core';

@Entity()
export class CatalogBrandCollections {

  @PrimaryKey()
  id!: number;

  @ManyToOne({ entity: () => CatalogBrands, fieldName: 'brand', deleteRule: 'cascade', unique: 'catalog_brand_collections_brand_title_uind' })
  brand!: CatalogBrands;

  @Property()
  title!: string;

  @Property({ nullable: true })
  image?: string;

	// gen - begin
	
	@OneToMany({ entity: () => CatalogProducts, mappedBy: 'collection', hidden: true })
	catalogProductsByCollection: Collection<CatalogProducts> & Hidden = new Collection<CatalogProducts>(this);
	
	@OneToMany({ entity: () => CollectionPropertyValues, mappedBy: 'instance', hidden: true })
	collectionPropertyValuesByInstance: Collection<CollectionPropertyValues> & Hidden = new Collection<CollectionPropertyValues>(this);
	
	// gen - end
}
