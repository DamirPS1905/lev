import { Entity, ManyToOne, PrimaryKey, PrimaryKeyProp, Property } from '@mikro-orm/core';
import { CatalogProductOffers } from './CatalogProductOffers';
import { CatalogProperties } from './CatalogProperties';

@Entity()
export class OfferPropertyValues {

  [PrimaryKeyProp]?: ['offer', 'property', 'order'];

  @ManyToOne({ entity: () => CatalogProductOffers, fieldName: 'offer', deleteRule: 'cascade', primary: true })
  offer!: CatalogProductOffers;

  @ManyToOne({ entity: () => CatalogProperties, fieldName: 'property', deleteRule: 'cascade', primary: true })
  property!: CatalogProperties;

  @PrimaryKey({ columnType: 'smallint' })
  order!: number;

  @Property()
  value!: bigint;

}
