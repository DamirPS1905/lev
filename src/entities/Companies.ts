import { Actors } from './Actors';
import { ApiKeys } from './ApiKeys';
import { Catalogs } from './Catalogs';
import { FileLoadTasks } from './FileLoadTasks';
import { PriceTypes } from './PriceTypes';
import { Stores } from './Stores';
import { UnitGroups } from './UnitGroups';
import { Units } from './Units';
import { Users } from './Users';
import { Collection, Entity, OneToMany, PrimaryKey, Property, Unique, type Hidden, type Opt } from '@mikro-orm/core';

@Entity()
export class Companies {

  @PrimaryKey()
  id!: number;

  @Unique({ name: 'companies_title_uind' })
  @Property()
  title!: string;

  @Property({ type: 'string', columnType: 'numeric(15,2)', defaultRaw: `0` })
  balance!: string & Opt;

	// gen - begin
	
	@OneToMany({ entity: () => Catalogs, mappedBy: 'company', hidden: true })
	catalogsByCompany: Collection<Catalogs> & Hidden = new Collection<Catalogs>(this);
	
	@OneToMany({ entity: () => Actors, mappedBy: 'company', hidden: true })
	actorsByCompany: Collection<Actors> & Hidden = new Collection<Actors>(this);
	
	@OneToMany({ entity: () => ApiKeys, mappedBy: 'company', hidden: true })
	apiKeysByCompany: Collection<ApiKeys> & Hidden = new Collection<ApiKeys>(this);
	
	@OneToMany({ entity: () => Users, mappedBy: 'company', hidden: true })
	usersByCompany: Collection<Users> & Hidden = new Collection<Users>(this);
	
	@OneToMany({ entity: () => UnitGroups, mappedBy: 'company', hidden: true })
	unitGroupsByCompany: Collection<UnitGroups> & Hidden = new Collection<UnitGroups>(this);
	
	@OneToMany({ entity: () => Units, mappedBy: 'company', hidden: true })
	unitsByCompany: Collection<Units> & Hidden = new Collection<Units>(this);
	
	@OneToMany({ entity: () => Stores, mappedBy: 'company', hidden: true })
	storesByCompany: Collection<Stores> & Hidden = new Collection<Stores>(this);
	
	@OneToMany({ entity: () => PriceTypes, mappedBy: 'company', hidden: true })
	priceTypesByCompany: Collection<PriceTypes> & Hidden = new Collection<PriceTypes>(this);
	
	@OneToMany({ entity: () => FileLoadTasks, mappedBy: 'company', hidden: true })
	fileLoadTasksByCompany: Collection<FileLoadTasks> & Hidden = new Collection<FileLoadTasks>(this);
	
	// gen - end
}
