import { Entity, Opt, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { Exclude } from 'class-transformer'

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

	@Exclude()
  @Property({ type: 'string' })
  symbol: string & Opt = '';

	@Exclude()
  @Property({ type: 'number' })
  precision: number & Opt = 4;

	@Exclude()
  @Property({ nullable: true })
  icon?: string;

}
