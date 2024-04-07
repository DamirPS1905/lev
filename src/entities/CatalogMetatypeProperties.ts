import { Entity, ManyToOne, PrimaryKeyProp, Property } from '@mikro-orm/core';
import { CatalogProperties } from './CatalogProperties';
import { Catalogs } from './Catalogs';
import { Metatypes } from './Metatypes';

@Entity()
export class CatalogMetatypeProperties {

  [PrimaryKeyProp]?: ['metatype', 'catalog', 'property'];

  @ManyToOne({ entity: () => Metatypes, fieldName: 'metatype', primary: true })
  metatype!: Metatypes;

  @ManyToOne({ entity: () => Catalogs, fieldName: 'catalog', deleteRule: 'cascade', primary: true })
  catalog!: Catalogs;

  @ManyToOne({ entity: () => CatalogProperties, fieldName: 'property', primary: true })
  property!: CatalogProperties;

  @Property({ columnType: 'jsonb' })
  scheme!: any;

}
