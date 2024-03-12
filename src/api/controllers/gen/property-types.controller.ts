import { AuthInfo } from './../../../decorators/auth.decorator'
import { ApiKeys } from './../../../entities/ApiKeys'
import { CreatePropertyTypeDto } from './../../dtos/create-property-type.dto'
import { UpdatePropertyTypeDto } from './../../dtos/update-property-type.dto'
import { CatalogsService } from './../../services/catalogs.service'
import { PropertyTypesService } from './../../services/property-types.service'
import { EntityManager } from '@mikro-orm/postgresql'
import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiExcludeEndpoint, ApiHeader, ApiTags } from '@nestjs/swagger'

@ApiHeader({ name: 'X-API-KEY', required: true })
@UseGuards(AuthGuard('api-key'))
@ApiTags('Property types')
@Controller('catalog/:catalog/types')
export class GenPropertyTypesController {
	constructor(
		protected readonly catalogsService: CatalogsService,
		protected readonly propertyTypesService: PropertyTypesService,
	) { }
	
	@Get(':id')
	async findOne(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('id', ParseIntPipe) id: number) {
		const catalogIns0 = await this.catalogsService.findById(catalog);
		if(catalogIns0===null || !(catalogIns0.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		const entity = await this.propertyTypesService.findById(id);
		if(entity===null || entity.catalog.id!==catalog){
			throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
		}
		this.validateRead(entity, apiKey, catalog, id);
		return entity;
	}
	
	@ApiExcludeEndpoint() validateRead(entity, apiKey: ApiKeys, catalog: number, id: number) { }
	
	@Post()
	async create(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Body() createDto: CreatePropertyTypeDto) {
		createDto.catalog = catalog;
		const catalogIns0 = await this.catalogsService.findById(catalog);
		if(catalogIns0===null || !(catalogIns0.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		return await this.propertyTypesService.transactional(async (em) => {
			this.validateCreate(apiKey, catalog, createDto, em);
			return await this.propertyTypesService.create(createDto, em);
		});
	}
	
	@ApiExcludeEndpoint() validateCreate(apiKey: ApiKeys, catalog: number, createDto: CreatePropertyTypeDto, em: EntityManager) { }
	
	@Patch(':id')
	async update(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdatePropertyTypeDto) {
		updateDto.catalog = catalog;
		const catalogIns0 = await this.catalogsService.findById(catalog);
		if(catalogIns0===null || !(catalogIns0.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		return await this.propertyTypesService.transactional(async (em) => {
			const entity = await this.propertyTypesService.findById(id, em);
			if(entity===null || entity.catalog.id!==catalog){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			this.validateUpdate(entity, apiKey, catalog, id, updateDto, em);
			return await this.propertyTypesService.update(entity, updateDto, em);
		});
	}
	
	@ApiExcludeEndpoint() validateUpdate(entity, apiKey: ApiKeys, catalog: number, id: number, updateDto: UpdatePropertyTypeDto, em: EntityManager) { }
	
	@Delete(':id')
	async delete(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('id', ParseIntPipe) id: number) {
		const catalogIns0 = await this.catalogsService.findById(catalog);
		if(catalogIns0===null || !(catalogIns0.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		return await this.propertyTypesService.transactional(async (em) => {
			const entity = await this.propertyTypesService.findById(id, em);
			if(entity===null || entity.catalog.id!==catalog){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			this.validateDelete(entity, apiKey, catalog, id, em);
			return await this.propertyTypesService.remove(entity, em);
		});
	}
	
	@ApiExcludeEndpoint() validateDelete(entity, apiKey: ApiKeys, catalog: number, id: number, em: EntityManager) { }
	
}