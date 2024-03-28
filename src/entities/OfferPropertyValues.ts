import { Entity, Index, ManyToOne, PrimaryKeyProp, Property } from '@mikro-orm/core';
import { CatalogProductOffers } from './CatalogProductOffers';
import { CatalogProperties } from './CatalogProperties';

@Entity()
export class OfferPropertyValues {

  [PrimaryKeyProp]?: ['offer', 'property'];

  @ManyToOne({ entity: () => CatalogProductOffers, fieldName: 'offer', deleteRule: 'cascade', primary: true })
  offer!: CatalogProductOffers;

  @ManyToOne({ entity: () => CatalogProperties, fieldName: 'property', primary: true })
  property!: CatalogProperties;

  @Index({ name: 'offer_property_values_keys_ind' })
  @Property()
  valueKey!: bigint;

}
