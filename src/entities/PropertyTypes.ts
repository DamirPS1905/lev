import { CatalogProperties } from './CatalogProperties';
import { Catalogs } from './Catalogs';
import { PropertyValues } from './PropertyValues';
import { Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property, Unique } from '@mikro-orm/core';

@Entity()
@Unique({ name: 'property_types_common_title_uind', expression: 'CREATE UNIQUE INDEX property_types_common_title_uind ON public.property_types USING btree (title) WHERE (catalog IS NULL)' })
export class PropertyTypes {

  @PrimaryKey()
  id!: number;

  @Unique({ name: 'property_types_common_title_uind' })
  @Property()
  title!: string;

  @Property({ columnType: 'jsonb' })
  scheme!: any;

  @ManyToOne({ entity: () => Catalogs, fieldName: 'catalog', nullable: true, unique: 'property_types_catalog_title_uind' })
  catalog?: Catalogs;



	// gen - begin
	
	@OneToMany({ entity: () => CatalogProperties, mappedBy: 'type' })
	catalogPropertiesByType = new Collection<CatalogProperties>(this);
	
	@OneToMany({ entity: () => PropertyValues, mappedBy: 'type' })
	propertyValuesByType = new Collection<PropertyValues>(this);
	
	// gen - end

}
