import { ProductRelations } from './ProductRelations';
import { Collection, Entity, OneToMany, PrimaryKey, Property, Unique, type Hidden } from '@mikro-orm/core';

@Entity()
export class ProductsRelationKinds {

  @PrimaryKey({ columnType: 'smallint' })
  id!: number;

  @Unique({ name: 'products_relation_kinds_title_uind' })
  @Property()
  title!: string;

	// gen - begin
	
	@OneToMany({ entity: () => ProductRelations, mappedBy: 'kind', hidden: true })
	productRelationsByKind: Collection<ProductRelations> & Hidden = new Collection<ProductRelations>(this);
	
	// gen - end
}
