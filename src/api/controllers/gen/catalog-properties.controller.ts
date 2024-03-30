/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/controllers/catalog-properties.controller
 * in a proper way.
 */
import { AuthInfo } from './../../../decorators/auth.decorator'
import { ApiKeys } from './../../../entities/ApiKeys'
import { CreateCatalogPropertyDto } from './../../dtos/create-catalog-property.dto'
import { UpdateCatalogPropertyDto } from './../../dtos/update-catalog-property.dto'
import { CatalogPropertiesService } from './../../services/catalog-properties.service'
import { CatalogsService } from './../../services/catalogs.service'
import { PropertyTypesService } from './../../services/property-types.service'
import { EntityManager } from '@mikro-orm/postgresql'
import { ClassSerializerInterceptor, Controller, HttpException, HttpStatus, UseGuards, UseInterceptors } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiHeader, ApiTags } from '@nestjs/swagger'

@ApiHeader({ name: 'X-API-KEY', required: true })
@UseGuards(AuthGuard('api-key'))
@ApiTags('Catalog properties')
@Controller('catalog/:catalog/properties')
@UseInterceptors(ClassSerializerInterceptor)
export class GenCatalogPropertiesController {
	constructor(
		protected readonly catalogPropertiesService: CatalogPropertiesService,
		protected readonly catalogsService: CatalogsService,
		protected readonly propertyTypesService: PropertyTypesService,
	) { }
	
	async findAll(apiKey: ApiKeys, catalog: number, offset: number, limit: number) {
		const catalogIns0 = await this.catalogsService.findById(catalog);
		if(catalogIns0===null || !(catalogIns0.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		if(offset<0) throw new HttpException('Wrong offset value', HttpStatus.BAD_REQUEST);
		if(limit<0) throw new HttpException('Wrong limit value', HttpStatus.BAD_REQUEST);
		if(limit>1000) limit = 1000; // throw new HttpException('Wrong limit value', HttpStatus.BAD_REQUEST);
		return await this.catalogPropertiesService.listByCatalog(catalog, offset, limit);
	}
	
	async findOne(apiKey: ApiKeys, catalog: number, id: number) {
		const catalogIns0 = await this.catalogsService.findById(catalog);
		if(catalogIns0===null || !(catalogIns0.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		const entity = await this.catalogPropertiesService.findById(id);
		if(entity===null || entity.catalog.id!==catalog){
			throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
		}
		await this.validateRead(entity, apiKey, catalog, id);
		return entity;
	}
	
	async validateRead(entity, apiKey: ApiKeys, catalog: number, id: number) { }
	
	async create(apiKey: ApiKeys, catalog: number, createDto: CreateCatalogPropertyDto) {
		createDto.catalog = catalog;
		const catalogIns0 = await this.catalogsService.findById(catalog);
		if(catalogIns0===null || !(catalogIns0.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		return await this.catalogPropertiesService.transactional(async (em) => {
			const existed0 = await this.catalogPropertiesService.findByCatalogAndTitle(createDto.catalog, createDto.title, em);
			if(existed0!==null){
				throw new HttpException('Duplicate (catalog, title)', HttpStatus.CONFLICT);
			}
			const tmp1 = await this.propertyTypesService.findById(createDto.type, em);
			if(tmp1===null){
				throw new HttpException('Not found contrainst (type)', HttpStatus.CONFLICT);
			}
			await this.validateCreate(apiKey, catalog, createDto, em);
			return await this.catalogPropertiesService.create(createDto, em);
		});
	}
	
	async validateCreate(apiKey: ApiKeys, catalog: number, createDto: CreateCatalogPropertyDto, em: EntityManager) { }
	
	async update(apiKey: ApiKeys, catalog: number, id: number, updateDto: UpdateCatalogPropertyDto) {
		updateDto.catalog = catalog;
		const catalogIns0 = await this.catalogsService.findById(catalog);
		if(catalogIns0===null || !(catalogIns0.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		return await this.catalogPropertiesService.transactional(async (em) => {
			const entity = await this.catalogPropertiesService.findById(id, em);
			if((updateDto.type!==undefined && updateDto.type!==entity.type.id)){
				const tmp2 = await this.propertyTypesService.findById(updateDto.type, em);
				if(tmp2===null){
					throw new HttpException('Not found contrainst (type)', HttpStatus.CONFLICT);
				}
			}
			if(entity===null || entity.catalog.id!==catalog){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			if((updateDto.catalog!==undefined && updateDto.catalog!==entity.catalog.id) || (updateDto.title!==undefined && updateDto.title!==entity.title)){
				const existed0 = await this.catalogPropertiesService.findByCatalogAndTitle(updateDto.catalog, updateDto.title, em);
				if(existed0!==null && (entity.id !== existed0.id)){
					throw new HttpException('Duplicate (catalog, title)', HttpStatus.CONFLICT);
				}
			}
			this.validateUpdate(entity, apiKey, catalog, id, updateDto, em);
			return await this.catalogPropertiesService.update(entity, updateDto, em);
		});
	}
	
	async validateUpdate(entity, apiKey: ApiKeys, catalog: number, id: number, updateDto: UpdateCatalogPropertyDto, em: EntityManager) { }
	
	async delete(apiKey: ApiKeys, catalog: number, id: number) {
		const catalogIns0 = await this.catalogsService.findById(catalog);
		if(catalogIns0===null || !(catalogIns0.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		return await this.catalogPropertiesService.transactional(async (em) => {
			const entity = await this.catalogPropertiesService.findById(id, em);
			if(entity===null || entity.catalog.id!==catalog){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			await this.validateDelete(entity, apiKey, catalog, id, em);
			return await this.catalogPropertiesService.remove(entity, em);
		});
	}
	
	async validateDelete(entity, apiKey: ApiKeys, catalog: number, id: number, em: EntityManager) { }
	
}