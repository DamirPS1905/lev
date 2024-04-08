import { AuthInfo } from './../../decorators/auth.decorator'
import { ApiKeys } from './../../entities/ApiKeys'
import { CreateCatalogPropertyDto } from './../dtos/create-catalog-property.dto'
import { UpdateCatalogPropertyDto } from './../dtos/update-catalog-property.dto'
import { CatalogPropertiesService } from './../services/catalog-properties.service'
import { GenCatalogPropertiesController } from './gen/catalog-properties.controller'
import { EntityManager } from '@mikro-orm/postgresql'
import { Body, DefaultValuePipe, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiQuery } from '@nestjs/swagger'

export class CatalogPropertiesController extends GenCatalogPropertiesController {
	
	@Get('all')
	@ApiQuery({name: 'limit', description: 'Maximum count of returning entities', required: false})
	@ApiQuery({ name: 'offset', description: 'Count of skipping entities', required: false})
	async findAll(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number, @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number) {
		return await super.findAll(apiKey, catalog, offset, limit);
	}
	
	@Get(':id')
	async findOne(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('id', ParseIntPipe) id: number) {
		return await super.findOne(apiKey, catalog, id);
	}
	
	@Post()
	async create(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Body() createDto: CreateCatalogPropertyDto) {
		return await super.create(apiKey, catalog, createDto);
	}
	
	async validateCreate(apiKey: ApiKeys, catalog: number, createDto: CreateCatalogPropertyDto, em: EntityManager) {
		try{
			const end = createDto.options===undefined? false: createDto.options,
						propertyTypeIns = await this.propertyTypesService.findById(createDto.type);
			createDto.scheme = await this.propertyTypesService.tunePropertyScheme(apiKey.company.id, propertyTypeIns.scheme, createDto.scheme, end);
		}catch(e){
			throw new HttpException(e.message, HttpStatus.CONFLICT);
		}
	}
	
	@Patch(':id')
	async update(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateCatalogPropertyDto) {
		return await super.update(apiKey, catalog, id, updateDto);
	}
	
	async validateUpdate(entity, apiKey: ApiKeys, catalog: number, id: number, updateDto: UpdateCatalogPropertyDto, em: EntityManager) {
		if(updateDto.scheme instanceof Object){
			try{
				const end = updateDto.options===undefined? entity.options: updateDto.options,
							propertyTypeIns = await this.propertyTypesService.findById(entity.type.id);
				updateDto.scheme = await this.propertyTypesService.tunePropertyScheme(apiKey.company.id, propertyTypeIns.scheme, updateDto.scheme, end);
			}catch(e){
				throw new HttpException(e.message, HttpStatus.CONFLICT);
			}
		}
	}
	
	@Delete(':id')
	async delete(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('id', ParseIntPipe) id: number) {
		return await super.delete(apiKey, catalog, id);
	}
	
	
}