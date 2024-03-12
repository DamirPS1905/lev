import { Entity, ManyToOne, OneToOne, Opt, PrimaryKey, Property } from '@mikro-orm/core';
import { Catalogs } from './Catalogs';

@Entity()
export class CatalogTypes {

  @PrimaryKey()
  id!: number;

  @ManyToOne({ entity: () => Catalogs, fieldName: 'catalog' })
  catalog!: Catalogs;

  @Property()
  title!: string;

  @OneToOne({ entity: () => CatalogTypes, fieldName: 'parent', nullable: true, unique: 'catalog_types_parent_title' })
  parent?: CatalogTypes;

  @Property({ type: 'boolean' })
  root: boolean & Opt = false;

  @Property({ columnType: 'smallint' })
  level!: number;

}
