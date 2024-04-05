import { GenPropertyTypesService } from './gen/property-types.service';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class PropertyTypesService extends GenPropertyTypesService {
	
  //@Cron('* * * * * *')
	async processPropertyTypes(){
		const conn = this.em.fork().getConnection(),
					query = `select id,
										(json_each(scheme)).key AS "key",
										(((json_each(scheme)).value)->>'kind')::int AS "primitive",
										(((json_each(scheme)).value)->>'index')::bool AS "index"
									from 
										property_types pt`,
					list = await conn.execute(query);
		cycle:
		for(let row of list){
			if(!row.index) continue;
			let type = null;
			switch(row.primitive){
				case 1: type = 'int'; break;
				case 2: type = 'float8'; break;
				case 3: type = 'varchar'; break;
				case 4: type = 'text'; break;
				case 5: type = 'int'; break;
				case 6: type = 'float8'; break;
				default: continue cycle;
			}
			const indexName = `property_values_${row.id}_${row.key}`,
						qu = `CREATE INDEX IF NOT EXISTS ${indexName} ON property_values (((value ->> '${row.key}')::${type}))
									WHERE "type"=${row.id}`;
			await conn.execute(qu);
		}
	}

	
}