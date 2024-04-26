"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const entity_generator_1 = require("@mikro-orm/entity-generator");
const postgresql_1 = require("@mikro-orm/postgresql");
require('dotenv').config();
console.log(process.env.DB_NAME);
console.log(process.env.DB_USER);
console.log(process.env.DB_PASS);
const config = {
    dbName: process.env.DB_NAME,
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASS,
    driver: postgresql_1.PostgreSqlDriver,
    extensions: [entity_generator_1.EntityGenerator],
    entities: ['./dist/entities/*.js'], // path to your JS entities (dist), relative to `baseDir`
    entitiesTs: ['./src/entities/*.ts'], // path to your TS entities (source), relative to `baseDir`
    debug: true,
};
exports.default = config;
//# sourceMappingURL=mikro-orm.config.js.map