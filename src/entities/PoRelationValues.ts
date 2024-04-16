import { Entity, ManyToOne, PrimaryKeyProp } from '@mikro-orm/core';
import { CatalogProductOffers } from './CatalogProductOffers';
import { CatalogProducts } from './CatalogProducts';
import { ProductRelations } from './ProductRelations';

@Entity()
export class PoRelationValues {

  [PrimaryKeyProp]?: ['relation', 'source', 'target'];

  @ManyToOne({ entity: () => ProductRelations, fieldName: 'relation', deleteRule: 'cascade', primary: true })
  relation!: ProductRelations;

  @ManyToOne({ entity: () => CatalogProducts, fieldName: 'source', deleteRule: 'cascade', primary: true })
  source!: CatalogProducts;

  @ManyToOne({ entity: () => CatalogProductOffers, fieldName: 'target', deleteRule: 'cascade', primary: true })
  target!: CatalogProductOffers;

}
