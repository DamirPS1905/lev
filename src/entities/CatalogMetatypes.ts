import { Entity, ManyToOne, OneToOne, PrimaryKey } from '@mikro-orm/core';
import { Catalogs } from './Catalogs';
import { Metatypes } from './Metatypes';

@Entity()
export class CatalogMetatypes {

  @PrimaryKey()
  id!: number;

  @OneToOne({ entity: () => Catalogs, fieldName: 'catalog', deleteRule: 'cascade', unique: 'catalog_metatypes_catalog_metatype_uind' })
  catalog!: Catalogs;

  @ManyToOne({ entity: () => Metatypes, fieldName: 'metatype' })
  metatype!: Metatypes;

}
