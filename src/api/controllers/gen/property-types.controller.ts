/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/controllers/property-types.controller
 * in a proper way.
 */
import { AuthInfo } from './../../../decorators/auth.decorator'
import { ApiKeys } from './../../../entities/ApiKeys'
import { CreatePropertyTypeDto } from './../../dtos/create-property-type.dto'
import { UpdatePropertyTypeDto } from './../../dtos/update-property-type.dto'
import { CatalogsService } from './../../services/catalogs.service'
import { PropertyTypesService } from './../../services/property-types.service'
import { EntityManager } from '@mikro-orm/postgresql'
import { Controller, HttpException, HttpStatus, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiHeader, ApiTags } from '@nestjs/swagger'

@ApiHeader({ name: 'X-API-KEY', required: true })
@UseGuards(AuthGuard('api-key'))
@ApiTags('Property types')
@Controller('catalog/:catalog/types')
export class GenPropertyTypesController {
	constructor(
		protected readonly catalogsService: CatalogsService,
		protected readonly propertyTypesService: PropertyTypesService,
	) { }
	
	async findAll(apiKey: ApiKeys, catalog: number, offset: number, limit: number) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		if(offset<0) throw new HttpException('Wrong offset value', HttpStatus.BAD_REQUEST);
		if(limit<0) throw new HttpException('Wrong limit value', HttpStatus.BAD_REQUEST);
		if(limit>1000) limit = 1000;
		return await this.propertyTypesService.listByCatalog(catalog, offset, limit);
	}
	
	async findOne(apiKey: ApiKeys, catalog: number, id: number) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		const entity = await this.propertyTypesService.findById(id);
		if(entity===null || !(entity.catalog.id===catalog)){
			throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
		}
		await this.validateRead(entity, apiKey, catalog, id);
		return entity;
	}
	
	async validateRead(entity, apiKey: ApiKeys, catalog: number, id: number) { }
	
	async create(apiKey: ApiKeys, catalog: number, createDto: CreatePropertyTypeDto) {
		createDto.catalog = catalog;
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		return await this.propertyTypesService.transactional(async (em) => {
			await this.validateCreate(apiKey, catalog, createDto, em);
			return await this.propertyTypesService.create(createDto, em);
		});
	}
	
	async validateCreate(apiKey: ApiKeys, catalog: number, createDto: CreatePropertyTypeDto, em: EntityManager) { }
	
	async update(apiKey: ApiKeys, catalog: number, id: number, updateDto: UpdatePropertyTypeDto) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		return await this.propertyTypesService.transactional(async (em) => {
			const entity = await this.propertyTypesService.findById(id, em);
			if(entity===null || !(entity.catalog.id===catalog)){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			this.validateUpdate(entity, apiKey, catalog, id, updateDto, em);
			return await this.propertyTypesService.update(entity, updateDto, em);
		});
	}
	
	async validateUpdate(entity, apiKey: ApiKeys, catalog: number, id: number, updateDto: UpdatePropertyTypeDto, em: EntityManager) { }
	
	async delete(apiKey: ApiKeys, catalog: number, id: number) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		return await this.propertyTypesService.transactional(async (em) => {
			const entity = await this.propertyTypesService.findById(id, em);
			if(entity===null || !(entity.catalog.id===catalog)){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			await this.validateDelete(entity, apiKey, catalog, id, em);
			return await this.propertyTypesService.remove(entity, em);
		});
	}
	
	async validateDelete(entity, apiKey: ApiKeys, catalog: number, id: number, em: EntityManager) { }
	
}