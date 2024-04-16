import { Catalogs } from './Catalogs';
import { OoRelationValues } from './OoRelationValues';
import { OpRelationValues } from './OpRelationValues';
import { PoRelationValues } from './PoRelationValues';
import { PpRelationValues } from './PpRelationValues';
import { ProductsRelationKinds } from './ProductsRelationKinds';
import { Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class ProductRelations {

  @PrimaryKey()
  id!: number;

  @ManyToOne({ entity: () => Catalogs, fieldName: 'catalog', deleteRule: 'cascade', unique: 'product_relations_catalog_title_uind' })
  catalog!: Catalogs;

  @Property()
  title!: string;

  @ManyToOne({ entity: () => ProductsRelationKinds, fieldName: 'kind' })
  kind!: ProductsRelationKinds;

  @Property()
  symmetric!: boolean;

	// gen - begin
	
	@OneToMany({ entity: () => PoRelationValues, mappedBy: 'relation' })
	poRelationValuesByRelation = new Collection<PoRelationValues>(this);
	
	@OneToMany({ entity: () => OpRelationValues, mappedBy: 'relation' })
	opRelationValuesByRelation = new Collection<OpRelationValues>(this);
	
	@OneToMany({ entity: () => OoRelationValues, mappedBy: 'relation' })
	ooRelationValuesByRelation = new Collection<OoRelationValues>(this);
	
	@OneToMany({ entity: () => PpRelationValues, mappedBy: 'relation' })
	ppRelationValuesByRelation = new Collection<PpRelationValues>(this);
	
	// gen - end
}
