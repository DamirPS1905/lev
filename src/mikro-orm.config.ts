import { Options, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EntityGenerator } from '@mikro-orm/entity-generator';

require('dotenv').config();

const config: Options = {
  dbName: 'lev',
  user: 'dev',
  host: 'localhost',
  password: process.env.DB_PASS,
  driver: PostgreSqlDriver,
  extensions: [EntityGenerator],
  entities: ['./dist/entities/*.js'], // path to your JS entities (dist), relative to `baseDir`
  entitiesTs: ['./src/entities/*.ts'], // path to your TS entities (source), relative to `baseDir`
	//debug: true
};

export default config;