import { Entity, type Hidden, ManyToOne, PrimaryKey } from '@mikro-orm/core';
import { Catalogs } from './Catalogs';
import { Metatypes } from './Metatypes';

@Entity()
export class CatalogMetatypes {

  @PrimaryKey()
  id!: number;

  @ManyToOne({ entity: () => Catalogs, fieldName: 'catalog', deleteRule: 'cascade', hidden: true, unique: 'catalog_metatypes_catalog_metatype_uind' })
  catalog!: Catalogs & Hidden;

  @ManyToOne({ entity: () => Metatypes, fieldName: 'metatype' })
  metatype!: Metatypes;

}
