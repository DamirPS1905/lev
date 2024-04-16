import { ProductRelations } from './ProductRelations';
import { Collection, Entity, OneToMany, PrimaryKey, Property, Unique } from '@mikro-orm/core';

@Entity()
export class ProductsRelationKinds {

  @PrimaryKey({ columnType: 'smallint' })
  id!: number;

  @Unique({ name: 'products_relation_kinds_title_uind' })
  @Property()
  title!: string;

	// gen - begin
	
	@OneToMany({ entity: () => ProductRelations, mappedBy: 'kind' })
	productRelationsByKind = new Collection<ProductRelations>(this);
	
	// gen - end
}
