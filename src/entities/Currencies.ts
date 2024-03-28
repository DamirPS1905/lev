import { Entity, Opt, PrimaryKey, Property, Unique } from '@mikro-orm/core';

@Entity()
export class Currencies {

  @PrimaryKey({ columnType: 'smallint' })
  id!: number;

  @Unique({ name: 'currencies_key_uind' })
  @Property()
  key!: string;

  @Unique({ name: 'currencies_title_uind' })
  @Property()
  title!: string;

  @Property({ type: 'string' })
  symbol: string & Opt = '';

  @Property({ type: 'number' })
  precision: number & Opt = 4;

  @Property({ nullable: true })
  icon?: string;

}
