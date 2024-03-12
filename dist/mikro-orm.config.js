"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const postgresql_1 = require("@mikro-orm/postgresql");
const entity_generator_1 = require("@mikro-orm/entity-generator");
require('dotenv').config();
const config = {
    dbName: 'lev',
    user: 'dev',
    password: process.env.DB_PASS,
    driver: postgresql_1.PostgreSqlDriver,
    extensions: [entity_generator_1.EntityGenerator],
    entities: ['./dist/entities/*.js'],
    entitiesTs: ['./src/entities/*.ts'],
};
exports.default = config;
//# sourceMappingURL=mikro-orm.config.js.map