import { Entity, ManyToOne, type Opt, PrimaryKeyProp, Property } from '@mikro-orm/core';
import { CatalogProductOffers } from './CatalogProductOffers';
import { CatalogProducts } from './CatalogProducts';
import { ProductRelations } from './ProductRelations';

@Entity()
export class OpRelationValues {

  [PrimaryKeyProp]?: ['relation', 'source', 'target'];

  @ManyToOne({ entity: () => ProductRelations, fieldName: 'relation', deleteRule: 'cascade', primary: true })
  relation!: ProductRelations;

  @ManyToOne({ entity: () => CatalogProductOffers, fieldName: 'source', deleteRule: 'cascade', primary: true })
  source!: CatalogProductOffers;

  @ManyToOne({ entity: () => CatalogProducts, fieldName: 'target', deleteRule: 'cascade', primary: true })
  target!: CatalogProducts;

  @Property({ autoincrement: true })
  version!: bigint;

  @Property({ type: 'boolean' })
  deleted: boolean & Opt = false;

  @Property({ type: 'Date', length: 6, defaultRaw: `CURRENT_TIMESTAMP` })
  changedAt!: Date & Opt;

}
