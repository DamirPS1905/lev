import { MikroORM } from '@mikro-orm/core';
import { EntityGenerator } from '@mikro-orm/entity-generator';
import { Options, PostgreSqlDriver } from '@mikro-orm/postgresql';
import * as fs from 'fs';

require('dotenv').config();


(async () => {
  const orm = await MikroORM.init({
    discovery: {
      // we need to disable validation for no entities
      warnWhenNoEntities: false,
    },
		dbName: 'lev',
	  user: 'dev',
	  host: 'localhost',
	  password: process.env.DB_PASS,
	  driver: PostgreSqlDriver,
	  extensions: [EntityGenerator],
	  entities: ['./dist/entities/*.js'],
	  entitiesTs: ['./src/entities/*.ts'],
  });
  const data = fs.readFileSync(process.cwd() + '/src/util/pref.json', 'utf8'),
    		info = JSON.parse(data),
			  getVal = (tbl, col, key) => {
				  const finfo = info.entities[tbl].fields[col],
				  			def = info.fieldsDefaults[finfo.def];
				  return finfo.hasOwnProperty(key)? finfo[key]: def[key];
			  }
  
  const dump = await orm.entityGenerator.generate({
    save: true,
    path: process.cwd() + '/src/entities',
    onInitialMetadata: (metadata, platform) => {
	    metadata.forEach(meta => {
		    const tbl = meta.collection;
	      meta.props.forEach(prop => {
		      const col = prop.fieldNames[0];
		      if(getVal(tbl, col, 'hidden')===true){
				    prop.hidden = true;
		      }
	      });
	    });
	  },
  });
  //console.log(dump);
  await orm.close(true);
})();