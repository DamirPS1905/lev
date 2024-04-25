import { Catalogs } from './Catalogs';
import { OoRelationValues } from './OoRelationValues';
import { OpRelationValues } from './OpRelationValues';
import { PoRelationValues } from './PoRelationValues';
import { PpRelationValues } from './PpRelationValues';
import { ProductsRelationKinds } from './ProductsRelationKinds';
import { Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property, type Hidden } from '@mikro-orm/core';

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
	
	@OneToMany({ entity: () => PpRelationValues, mappedBy: 'relation', hidden: true })
	ppRelationValuesByRelation: Collection<PpRelationValues> & Hidden = new Collection<PpRelationValues>(this);
	
	@OneToMany({ entity: () => PoRelationValues, mappedBy: 'relation', hidden: true })
	poRelationValuesByRelation: Collection<PoRelationValues> & Hidden = new Collection<PoRelationValues>(this);
	
	@OneToMany({ entity: () => OpRelationValues, mappedBy: 'relation', hidden: true })
	opRelationValuesByRelation: Collection<OpRelationValues> & Hidden = new Collection<OpRelationValues>(this);
	
	@OneToMany({ entity: () => OoRelationValues, mappedBy: 'relation', hidden: true })
	ooRelationValuesByRelation: Collection<OoRelationValues> & Hidden = new Collection<OoRelationValues>(this);
	
	// gen - end
}
