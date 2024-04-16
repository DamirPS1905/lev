import { Entity, ManyToOne, PrimaryKeyProp } from '@mikro-orm/core';
import { CatalogProductOffers } from './CatalogProductOffers';
import { ProductRelations } from './ProductRelations';

@Entity()
export class OoRelationValues {

  [PrimaryKeyProp]?: ['relation', 'source', 'target'];

  @ManyToOne({ entity: () => ProductRelations, fieldName: 'relation', deleteRule: 'cascade', primary: true })
  relation!: ProductRelations;

  @ManyToOne({ entity: () => CatalogProductOffers, fieldName: 'source', deleteRule: 'cascade', primary: true })
  source!: CatalogProductOffers;

  @ManyToOne({ entity: () => CatalogProductOffers, fieldName: 'target', deleteRule: 'cascade', primary: true })
  target!: CatalogProductOffers;

}
