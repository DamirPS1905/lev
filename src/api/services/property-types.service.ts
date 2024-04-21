import { GenPropertyTypesService } from './gen/property-types.service';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PropertyTypes } from './../../entities/PropertyTypes'
import { Units } from './../../entities/Units'
import { UnitGroups } from './../../entities/UnitGroups'
import { EntityManager } from '@mikro-orm/postgresql'
import { PropertyTuningDto } from './../dtos/property-tuning.dto'
import { FileLoadTasksService } from './file-load-tasks.service'
import { CreateFileLoadTaskDto } from './../dtos/create-file-load-task.dto'
import { FilesService } from './special/files.service';

@Injectable()
export class PropertyTypesService extends GenPropertyTypesService {
	
	private schemesCache = new Map<number, Object>();
	private processorsCache = new Map<number, Function>();
	
	constructor(
		protected readonly fileLoadTasksService: FileLoadTasksService,
		em: EntityManager,
		fm: FilesService,
	){
		super(em, fm);
	}
	
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
			let type = null,
					indexKey = row.key;
			switch(row.primitive){
				case 1: type = 'int'; break;
				case 2: type = 'float8'; break;
				case 3: type = 'varchar'; break;
				case 4: type = 'text'; break;
				case 5: type = 'int'; indexKey += 'Index'; break;
				case 6: type = 'float8'; indexKey += 'Index'; break;
				case 8: type = 'bool'; break;
				default: continue cycle;
			}
			const indexName = `property_values_${row.id}_${row.key}`,
						qu = `CREATE INDEX IF NOT EXISTS ${indexName} ON property_values (((value ->> '${indexKey}')::${type}))
									WHERE "type"=${row.id}`;
			await conn.execute(qu);
		}
	}
	
	private async requireScheme(type: number){
		if(this.schemesCache.has(type)) return this.schemesCache.get(type);
		const typeIns = await this.findById(type);
		if(typeIns!==null){
			this.schemesCache.set(type, typeIns.scheme);
			return typeIns.scheme;
		}else{
			throw new Error('Unknown property type');
		}
	}
	
	public getPrimitiveTransform(primitive: number, key: string){
		switch(primitive){
			case 5: 
			case 6: return `[o.${key}, o.${key}Unit]`;
			default: return `o.${key}`;
		}
	}
	
	private async requireProcessor(type: number){
		if(this.processorsCache.has(type)) return this.processorsCache.get(type);
		const scheme = await this.requireScheme(type), keys = Object.keys(scheme);
		let body = 'return ';
		if(keys.length===1){
			body += this.getPrimitiveTransform(scheme[keys[0]].kind, keys[0]);
		}else{
			body += '{'+keys
				.map(key => `"${key}": `+this.getPrimitiveTransform(scheme[key].kind, key))
				.join(',')+'}';
		}
		body += ';';
		const fn = new Function('o', body);
		this.processorsCache.set(type, fn);
		return fn;
	}
	
	public async short(type: number, value: object | Array<object>){
		const proc = await this.requireProcessor(type);
		if(Array.isArray(value)){
			return value.map(p => proc(p));
		}else{
			return proc(value);
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
	
	public convertValue(from: Units, to: Units, value: number){
		if(from.id===to.id) return value;
		return from.factor*(value - from.add)/to.factor + to.add;
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
	
	getValueScheme(scheme: any){
		let result: Object = {};
		for(let key of Object.keys(scheme)){
			const info = scheme[key],
						hasUnit = info.kind==5 || info.kind==6;
			switch(info.kind){
				case 1:
					result[key] = "integer";
					break;
				case 2:
					result[key] = "number";
					break;
				case 3:
				case 4:
					result[key] = "string";
					break;
				case 5:
					result[key] = "integer";
					result[key+"Unit"] = "integer (id of unit)";
					break;
				case 6:
					result[key] = "number";
					result[key+"Unit"] = "integer (id of unit)";
					break;
				case 7:
				case 9:
					result[key] = "string (from existed image: `[key]` or from base64 content: `b64:[extension]:[base-64 encoded content]` or from url: `url:[extension]:[publically available url]` or `url::[publically available url]`)";
					break;
				case 8:
					result[key] = "boolean";
					break;
			}
		}
		return result;
	}
	
	async tunePropertyScheme(company: number, sourceScheme: any, tuning: Map<string, PropertyTuningDto>, create: boolean = false){
		const resultScheme = new Map<string, PropertyTuningDto>();
		for(let key of Object.keys(sourceScheme)){
			let schemeInfo = new PropertyTuningDto();
			const info = sourceScheme[key],
						hasUnit = info.kind==5 || info.kind==6;
			const fieldsList = hasUnit
				? ['kind', 'unitsGroup', 'storageUnit', 'defaultUnit', 'displayUnit', 'defaultValue']
				: ['kind', 'defaultValue'];
			for(let k of fieldsList){
				if(info.hasOwnProperty(k)){
					schemeInfo[k] = info[k];
				}
			}
			if(tuning.has(key)){
				const fieldInfo = tuning.get(key);
				if(hasUnit){
					if(create){
						if(fieldInfo.unitsGroup!==undefined){
							schemeInfo.unitsGroup = fieldInfo.unitsGroup;
						}
						if(fieldInfo.storageUnit!==undefined){
							schemeInfo.storageUnit = fieldInfo.storageUnit;
						}
					}
					if(fieldInfo.defaultUnit!==undefined){
						schemeInfo.defaultUnit = fieldInfo.defaultUnit;
					}
					if(fieldInfo.displayUnit!==undefined){
						schemeInfo.displayUnit = fieldInfo.displayUnit;
					}
				}
				if(fieldInfo.defaultValue!==undefined){
					schemeInfo.defaultValue = fieldInfo.defaultValue;
					this.validateKindValue(info.kind, schemeInfo.defaultValue);
					if(hasUnit && schemeInfo.defaultUnit===undefined){
						throw new Error(`When default value (${key}.defaultValue) is provided, default unit (${key}.defaultUnit) also should be proided for field ${key} (${key}.defaultUnit)`);
					}
				}
			}
			if(hasUnit && schemeInfo.unitsGroup===undefined && create){
				throw new Error(`Units group for field ${key} (${key}.unitsGroup) not provided`);
			}
			if(hasUnit && schemeInfo.storageUnit===undefined && create){
				throw new Error(`Storage unit for field ${key} (${key}.storageUnit) not provided`);
			}
			if(hasUnit){
				const em = this.em.fork(),
							unitGroup = await this.getUnitGroup(schemeInfo.unitsGroup, company, em);
				if(unitGroup===null){
					throw new Error(`Units group for field ${key} (${key}.unitsGroup) not found`);
				}
				for(let k of ['storageUnit', 'defaultUnit', 'displayUnit']){
					if(schemeInfo[k]!==undefined){
						const unit = await this.getUnit(schemeInfo[k], company, em);
						if(unit===null || unit.group.id!==unitGroup.id){
							throw new Error(`Unit for field ${key}.${k} not found in units group`);
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
			case 8:
				if(typeof val!=="boolean"){
					throw new Error('Value field ${key} assumed to be boolean');
				}
				break;
			case 3:
			case 4:
			case 7:
			case 9:
				if(typeof val!=="string"){
					throw new Error('Value field ${key} assumed to be string');
				}
				break;
		}
	}
	
	async validateSingleValue(company: number, scheme: any, value: any, catalog: number, emt: EntityManager = null){
		if(!(value instanceof Object)) throw new Error('Value assumed to be an object');
		for(let key of Object.keys(scheme)){
			const info = scheme[key];
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
					const em = this.getEm(emt),
								unitKey = `${key}Unit`;
					if(!value.hasOwnProperty(unitKey)){
						if(info.hasOwnProperty('defaultUnit')){
							value[unitKey] = info.defaultUnit;
						}else{
							throw new Error(`Required field ${unitKey} not provided`);
						}
					}else{
						const unitGroup = await this.getUnitGroup(info.unitsGroup, company, em),
									unit = await this.getUnit(value[unitKey], company, em);
						if(unit===null || unit.group.id!==unitGroup.id){
							throw new Error(`Unit for field ${unitKey} not found in units group`);
						}
					}
					const sourceUnit = await this.getUnit(value[unitKey], company, em),
								targetUnit = await this.getUnit(info.storageUnit, company, em);
					value[key+'Index'] = this.convertValue(sourceUnit, targetUnit, value[key]);
					break;
				case 7:
				case 9:
					value[key] = this.fileLoadTasksService
						.processInput(company, catalog, value[key], info.kind===9, emt);
					break;
			}
		}
		return value;
	}
	
	findAllByCatalog(catalog: number, emt: EntityManager = null) {
		return this.getEm(emt).find(PropertyTypes, {
			$or: [
				{ catalog: catalog },
				{ catalog: { $eq: null } }
			]
		}, {
			orderBy: { id: "ASC" },
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