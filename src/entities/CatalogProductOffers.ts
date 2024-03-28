import { Collection, Entity, ManyToMany, ManyToOne, OneToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { CatalogProducts } from './CatalogProducts';
import { Catalogs } from './Catalogs';
import { OfferAmounts } from './OfferAmounts';
import { Stores } from './Stores';

@Entity()
export class CatalogProductOffers {

  @PrimaryKey()
  id!: bigint;

  @ManyToOne({ entity: () => CatalogProducts, fieldName: 'product' })
  product!: CatalogProducts;

  @OneToOne({ entity: () => Catalogs, fieldName: 'catalog', unique: 'catalog_product_offers_catalog_article_uind' })
  catalog!: Catalogs;

  @Property()
  article!: string;

  @Property({ length: 6 })
  created!: Date;

  @ManyToMany({ entity: () => Stores, pivotTable: 'offer_amounts', pivotEntity: () => OfferAmounts, joinColumn: 'offer', inverseJoinColumn: 'store' })
  offerAmounts = new Collection<Stores>(this);

}
