import { GenPropertyTypesService } from './gen/property-types.service';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PropertyTypes } from './../../entities/PropertyTypes'
import { Units } from './../../entities/Units'
import { UnitGroups } from './../../entities/UnitGroups'
import { EntityManager } from '@mikro-orm/postgresql'

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
	
	private getUnit(id: number, company: number, emt: EntityManager = null){
		return this.getEm(emt).findOne(Units, {
			id: id,
			$or: [
				{ company: company },
				{ company: { $eq: null } }
			]
		});
	}
	
	private getUnitGroup(id: number, company: number, emt: EntityManager = null){
		return this.getEm(emt).findOne(UnitGroups, {
			id: id,
			$or: [
				{ company: company },
				{ company: { $eq: null } }
			]
		});
	}
	
	async tunePropertyScheme(company: number, sourceScheme: any, tuning: any){
		if(!(tuning instanceof Object)) throw new Error('Scheme assumed to be an object');
		let resultScheme: {[k: string]: any} = {};
		for(let key in Object.keys(sourceScheme)){
			let schemeInfo: {[k: string]: any} = {};
			const info = sourceScheme[key],
						hasUnit = info.kind==5 || info.kind==6;
			for(let k of ['kind', 'unitsGroup', 'storageUnit', 'defultUnit', 'displayUnit', 'defultValue']){
				if(info.hasOwnProperty(k)){
					schemeInfo[k] = info[k];
				}
			}
			if(tuning.hasOwnProperty(key)){
				const fieldInfo = tuning[key];
				if(hasUnit){
					if(fieldInfo.hasOwnProperty('unitsGroup')){
						schemeInfo.unitsGroup = fieldInfo.unitsGroup;
					}else{
						throw new Error(`Units group for field ${key} (${key}.unitsGroup) not provided`);
					}
					if(fieldInfo.hasOwnProperty('storageUnit')){
						schemeInfo.storageUnit = fieldInfo.storageUnit;
					}
					if(fieldInfo.hasOwnProperty('defultUnit')){
						schemeInfo.defultUnit = fieldInfo.defultUnit;
					}
					if(fieldInfo.hasOwnProperty('displayUnit')){
						schemeInfo.displayUnit = fieldInfo.displayUnit;
					}
				}
				if(fieldInfo.hasOwnProperty('defultValue')){
					schemeInfo.defultValue = fieldInfo.defultValue;
					this.validateKindValue(info.kind, schemeInfo.defultValue);
					if(hasUnit && !schemeInfo.hasOwnProperty('defultUnit')){
						throw new Error(`When default value is provided, default unit also should be proided for field ${key} (${key}.defultUnit)`);
					}
				}
			}
			if(hasUnit && !schemeInfo.hasOwnProperty('unitsGroup')){
				throw new Error(`Units group for field ${key} (${key}.unitsGroup) not provided`);
			}
			if(hasUnit){
				const em = this.em.fork(),
							unitGroup = await this.getUnitGroup(schemeInfo.unitsGroup, company, em);
				if(unitGroup===null){
					throw new Error(`Units group for field ${key} not found`);
				}
				for(let k of ['storageUnit', 'defultUnit', 'displayUnit']){
					if(schemeInfo.hasOwnProperty(k)){
						const unit = await this.getUnit(schemeInfo[k], company, em);
						if(unit===null || unit.group.id!==unitGroup.id){
							throw new Error(`Units group for field ${key}.${k} not found in units group`);
						}
					}
				}
			}
			resultScheme[key] = schemeInfo;
		}
		return resultScheme;
	}
		
	validateKindValue(kind: number, val: any){
		switch(kind){
			case 1:
			case 5:
				if(!Number.isInteger(val)){
					throw new Error('Value field ${key} assumed to be integer');
				}
				break;
			case 2:
			case 6:
				if(typeof val!=="number"){
					throw new Error('Value field ${key} assumed to be number');
				}
				break;
			case 3:
			case 4:
				if(typeof val!=="string"){
					throw new Error('Value field ${key} assumed to be string');
				}
				break;
		}
	}
	
	validateSingleValue(propertyType: PropertyTypes, value: any){
		if(!(value instanceof Object)) throw new Error('Value assumed to be an object');
		for(let key in Object.keys(propertyType.scheme)){
			const info = propertyType.scheme[key];
			if(!value.hasOwnProperty(key)){
				if(info.hasOwnProperty('defaultValue')){
					value[key] = info.defaultValue;
				}else{
					throw new Error(`Required field ${key} not provided`);
				}
			}
			this.validateKindValue(info.kind, value[key]);
			switch(info.kind){
				case 5:
				case 6:
					const unitKey = `${key}Unit`;
					if(!value.hasOwnProperty(unitKey)){
						if(info.hasOwnProperty('defaultUnit')){
							value[unitKey] = info.defaultUnit;
						}else{
							throw new Error(`Required field ${unitKey} not provided`);
						}
					}
					break;
			}
		}
	}
	
	findAllByCatalog(catalog: number, emt: EntityManager = null) {
		return this.getEm(emt).find(PropertyTypes, {
			$or: [
				{ catalog: catalog },
				{ catalog: { $eq: null } }
			]
		});
	}
	
	listByCatalog(catalog: number, offset: number, limit: number, emt: EntityManager = null) {
		return this.getEm(emt).find(PropertyTypes, {
			$or: [
				{ catalog: catalog },
				{ catalog: { $eq: null } }
			]
		}, {
			limit: limit,
			offset: offset,
			orderBy: { id: "ASC" },
		});
	}

	
	findCommonByTitle(title: string, emt: EntityManager = null) {
		return this.getEm(emt).findOne(PropertyTypes, {
			title: title,
			catalog: { $eq: null }
		});
  }

	findByCatalogAndTitle(catalog: number, title: string, emt: EntityManager = null) {
		return this.getEm(emt).findOne(PropertyTypes, {
			title: title,
			catalog: catalog
		});
  }

	
}