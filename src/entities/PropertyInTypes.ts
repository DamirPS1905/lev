import { Entity, ManyToOne, PrimaryKeyProp, Property } from '@mikro-orm/core';
import { CatalogProperties } from './CatalogProperties';
import { CatalogTypes } from './CatalogTypes';

@Entity()
export class PropertyInTypes {

  [PrimaryKeyProp]?: ['type', 'property'];

  @ManyToOne({ entity: () => CatalogTypes, fieldName: 'type', deleteRule: 'cascade', primary: true })
  type!: CatalogTypes;

  @ManyToOne({ entity: () => CatalogProperties, fieldName: 'property', deleteRule: 'cascade', primary: true })
  property!: CatalogProperties;

  @Property({ columnType: 'jsonb' })
  scheme!: any;

}
