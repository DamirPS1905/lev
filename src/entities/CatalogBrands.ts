import { BrandPropertyValues } from './BrandPropertyValues';
import { CatalogProducts } from './CatalogProducts';
import { Catalogs } from './Catalogs';
import { Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';

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

  @Property({ columnType: 'jsonb', nullable: true })
  logo?: any;

	// gen - begin
	
	@OneToMany({ entity: () => CatalogProducts, mappedBy: 'brand' })
	catalogProductsByBrand = new Collection<CatalogProducts>(this);
	
	@OneToMany({ entity: () => BrandPropertyValues, mappedBy: 'instance' })
	brandPropertyValuesByInstance = new Collection<BrandPropertyValues>(this);
	
	// gen - end

}
