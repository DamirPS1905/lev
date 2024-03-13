/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/controllers/catalog-types.controller
 * in a proper way.
 */
import { AuthInfo } from './../../../decorators/auth.decorator'
import { ApiKeys } from './../../../entities/ApiKeys'
import { CreateCatalogTypeDto } from './../../dtos/create-catalog-type.dto'
import { UpdateCatalogTypeDto } from './../../dtos/update-catalog-type.dto'
import { CatalogTypesOverloadService } from './../../services/catalog-types-overload.service'
import { CatalogTypesService } from './../../services/catalog-types.service'
import { CatalogsService } from './../../services/catalogs.service'
import { EntityManager } from '@mikro-orm/postgresql'
import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiHeader, ApiTags } from '@nestjs/swagger'

@ApiHeader({ name: 'X-API-KEY', required: true })
@UseGuards(AuthGuard('api-key'))
@ApiTags('Catalog types')
@Controller('catalog/:catalog/type')
export class GenCatalogTypesController {
	constructor(
		protected readonly catalogTypesOverloadService: CatalogTypesOverloadService,
		protected readonly catalogTypesService: CatalogTypesService,
		protected readonly catalogsService: CatalogsService,
	) { }
	
	@Get(':id')
	async findOne(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('id', ParseIntPipe) id: number) {
		const catalogIns0 = await this.catalogsService.findById(catalog);
		if(catalogIns0===null || !(catalogIns0.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		const entity = await this.catalogTypesService.findById(id);
		if(entity===null || entity.catalog.id!==catalog){
			throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
		}
		this.validateRead(entity, apiKey, catalog, id);
		return entity;
	}
	
	validateRead(entity, apiKey: ApiKeys, catalog: number, id: number) { }
	
	@Post()
	async create(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Body() createDto: CreateCatalogTypeDto) {
		createDto.catalog = catalog;
		const catalogIns0 = await this.catalogsService.findById(catalog);
		if(catalogIns0===null || !(catalogIns0.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		return await this.catalogTypesService.transactional(async (em) => {
			const existed1 = await this.catalogTypesService.findByTitleAndParent(createDto.title, createDto.parent, em);
			if(existed1!==null){
				throw new HttpException('Duplicate (title, parent)', HttpStatus.CONFLICT);
			}
			const parentIns1 = await this.catalogTypesService.findById(createDto.parent);
			if(parentIns1===null || !(parentIns1.catalog.id===catalog)){
				throw new HttpException('Parent type not found', HttpStatus.CONFLICT);
			}
			this.validateCreate(apiKey, catalog, createDto, em);
			return await this.catalogTypesService.create(createDto, em);
		});
	}
	
	validateCreate(apiKey: ApiKeys, catalog: number, createDto: CreateCatalogTypeDto, em: EntityManager) { }
	
	@Patch(':id')
	async update(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateCatalogTypeDto) {
		updateDto.catalog = catalog;
		const catalogIns0 = await this.catalogsService.findById(catalog);
		if(catalogIns0===null || !(catalogIns0.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		return await this.catalogTypesService.transactional(async (em) => {
			const entity = await this.catalogTypesService.findById(id, em);
			if((updateDto.parent!==undefined && updateDto.parent!==entity.parent.id)){
				const parentIns2 = await this.catalogTypesService.findById(updateDto.parent);
				if(parentIns2===null || !(parentIns2.catalog.id===catalog)){
					throw new HttpException('Parent type not found', HttpStatus.CONFLICT);
				}
			}
			if(entity===null || entity.catalog.id!==catalog){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			if((updateDto.title!==undefined && updateDto.title!==entity.title) || (updateDto.parent!==undefined && updateDto.parent!==entity.parent.id)){
				const existed1 = await this.catalogTypesService.findByTitleAndParent(updateDto.title, updateDto.parent, em);
				if(existed1!==null && (entity.id !== existed1.id)){
					throw new HttpException('Duplicate (title, parent)', HttpStatus.CONFLICT);
				}
			}
			this.validateUpdate(entity, apiKey, catalog, id, updateDto, em);
			return await this.catalogTypesService.update(entity, updateDto, em);
		});
	}
	
	validateUpdate(entity, apiKey: ApiKeys, catalog: number, id: number, updateDto: UpdateCatalogTypeDto, em: EntityManager) { }
	
	@Delete(':id')
	async delete(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('id', ParseIntPipe) id: number) {
		const catalogIns0 = await this.catalogsService.findById(catalog);
		if(catalogIns0===null || !(catalogIns0.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		return await this.catalogTypesService.transactional(async (em) => {
			const entity = await this.catalogTypesService.findById(id, em);
			if(entity===null || entity.catalog.id!==catalog){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			this.validateDelete(entity, apiKey, catalog, id, em);
			return await this.catalogTypesService.remove(entity, em);
		});
	}
	
	validateDelete(entity, apiKey: ApiKeys, catalog: number, id: number, em: EntityManager) { }
	
}