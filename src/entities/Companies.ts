import { ApiKeys } from './ApiKeys';
import { Catalogs } from './Catalogs';
import { PriceTypes } from './PriceTypes';
import { Stores } from './Stores';
import { UnitGroups } from './UnitGroups';
import { Units } from './Units';
import { Users } from './Users';
import { Collection, Entity, OneToMany, PrimaryKey, Property, Unique } from '@mikro-orm/core';

@Entity()
export class Companies {

  @PrimaryKey()
  id!: number;

  @Unique({ name: 'companies_title_uind' })
  @Property()
  title!: string;

	// gen - begin
	
	@OneToMany({ entity: () => Catalogs, mappedBy: 'company' })
	catalogsByCompany = new Collection<Catalogs>(this);
	
	@OneToMany({ entity: () => ApiKeys, mappedBy: 'company' })
	apiKeysByCompany = new Collection<ApiKeys>(this);
	
	@OneToMany({ entity: () => Users, mappedBy: 'company' })
	usersByCompany = new Collection<Users>(this);
	
	@OneToMany({ entity: () => UnitGroups, mappedBy: 'company' })
	unitGroupsByCompany = new Collection<UnitGroups>(this);
	
	@OneToMany({ entity: () => Units, mappedBy: 'company' })
	unitsByCompany = new Collection<Units>(this);
	
	@OneToMany({ entity: () => Stores, mappedBy: 'company' })
	storesByCompany = new Collection<Stores>(this);
	
	@OneToMany({ entity: () => PriceTypes, mappedBy: 'company' })
	priceTypesByCompany = new Collection<PriceTypes>(this);
	
	// gen - end
}
