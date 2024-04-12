import { Collection, Entity, OneToMany, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { CatalogMetatypes } from './CatalogMetatypes';

@Entity()
export class Metatypes {

  @PrimaryKey()
  id!: number;

  @Unique({ name: 'metatypes_title_uind' })
  @Property()
  title!: string;

  @OneToMany({ entity: () => CatalogMetatypes, mappedBy: 'metatype' })
  metatypeInverse = new Collection<CatalogMetatypes>(this);

}
