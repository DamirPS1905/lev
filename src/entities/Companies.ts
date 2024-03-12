import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core';

@Entity()
export class Companies {

  @PrimaryKey()
  id!: number;

  @Unique({ name: 'companies_title_uind' })
  @Property()
  title!: string;

}
