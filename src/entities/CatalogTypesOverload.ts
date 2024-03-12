import { Entity, ManyToOne, PrimaryKeyProp, Property } from '@mikro-orm/core';
import { CatalogTypes } from './CatalogTypes';

@Entity()
export class CatalogTypesOverload {

  [PrimaryKeyProp]?: ['parent', 'child'];

  @ManyToOne({ entity: () => CatalogTypes, fieldName: 'parent', deleteRule: 'cascade', primary: true })
  parent!: CatalogTypes;

  @ManyToOne({ entity: () => CatalogTypes, fieldName: 'child', deleteRule: 'cascade', primary: true })
  child!: CatalogTypes;

  @Property({ columnType: 'smallint' })
  delta!: number;

}
