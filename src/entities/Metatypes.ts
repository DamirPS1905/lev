import { CatalogMetatypeProperties } from './CatalogMetatypeProperties';
import { Collection, Entity, OneToMany, PrimaryKey, Property, Unique } from '@mikro-orm/core';

@Entity()
export class Metatypes {

  @PrimaryKey()
  id!: number;

  @Unique({ name: 'metatypes_title_uind' })
  @Property()
  title!: string;

	// gen - begin
	
	@OneToMany({ entity: () => CatalogMetatypeProperties, mappedBy: 'metatype' })
	catalogMetatypePropertiesByMetatype = new Collection<CatalogMetatypeProperties>(this);
	
	// gen - end
}
