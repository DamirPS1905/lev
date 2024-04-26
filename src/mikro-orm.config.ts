import { EntityGenerator } from '@mikro-orm/entity-generator';
import { Options, PostgreSqlDriver } from '@mikro-orm/postgresql';

require('dotenv').config();
console.log(process.env.DB_NAME);
console.log(process.env.DB_USER);
console.log(process.env.DB_PASS);
const config: Options = {
  dbName: process.env.DB_NAME,
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASS,
  driver: PostgreSqlDriver,
  extensions: [EntityGenerator],
  entities: ['./dist/entities/*.js'], // path to your JS entities (dist), relative to `baseDir`
  entitiesTs: ['./src/entities/*.ts'], // path to your TS entities (source), relative to `baseDir`
  debug: true,
};

export default config;
