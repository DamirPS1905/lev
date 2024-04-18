import { MikroORM, ReferenceKind } from '@mikro-orm/core';
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
			  getVal = (tbl, col, key, defValue) => {
				  if(!info.entities.hasOwnProperty(tbl)) return defValue;
				  if(!info.entities[tbl].fields.hasOwnProperty(col)) return defValue;
				  const finfo = info.entities[tbl].fields[col],
				  			def = info.fieldsDefaults[finfo.def];
				  return finfo.hasOwnProperty(key)? finfo[key]: def[key];
			  }
  
  const dump = await orm.entityGenerator.generate({
    save: true,
    path: process.cwd() + '/src/entities',
    onInitialMetadata: (metadata, platform) => {
	    metadata.forEach(meta => {
		    //console.log(meta);
		    const tbl = meta.collection;
	      meta.props.forEach(prop => {
		      const col = prop.fieldNames[0];
		      if(getVal(tbl, col, 'hidden', false)===true){
				    prop.hidden = true;
		      }
	      });
	    });
	  },
	  onProcessedMetadata: (metadata, platform) => {
	    metadata.forEach(meta => {
		    meta.indexes.forEach(p => {
			    p.expression = p.expression.replace(/['']/g, "\\'");
		    })
		    const tbl = meta.collection;
		    meta.props.forEach(prop => {
	        if (prop.kind === ReferenceKind.MANY_TO_MANY) {
	          prop.hidden = true;
	        }
	      });
		    meta.relations.forEach(p => {
			    if(p.kind===ReferenceKind.ONE_TO_ONE){
				    if(!getVal(tbl, p.name, 'unique', false))
			    		p.kind = ReferenceKind.MANY_TO_ONE
			    }
		    })
	    });
	  },
  });
  //console.log(dump);
  await orm.close(true);
})();