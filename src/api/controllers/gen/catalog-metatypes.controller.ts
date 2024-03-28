/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/controllers/catalog-metatypes.controller
 * in a proper way.
 */
import { AuthInfo } from './../../../decorators/auth.decorator'
import { ApiKeys } from './../../../entities/ApiKeys'
import { CreateCatalogMetatypeDto } from './../../dtos/create-catalog-metatype.dto'
import { UpdateCatalogMetatypeDto } from './../../dtos/update-catalog-metatype.dto'
import { CatalogMetatypesService } from './../../services/catalog-metatypes.service'
import { CatalogsService } from './../../services/catalogs.service'
import { MetatypesService } from './../../services/metatypes.service'
import { EntityManager } from '@mikro-orm/postgresql'
import { Controller, HttpException, HttpStatus, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiHeader, ApiTags } from '@nestjs/swagger'

@ApiHeader({ name: 'X-API-KEY', required: true })
@UseGuards(AuthGuard('api-key'))
@ApiTags('Catalog metatypes')
@Controller('catalog/:catalog/catalog-metatype')
export class GenCatalogMetatypesController {
	constructor(
		protected readonly catalogMetatypesService: CatalogMetatypesService,
		protected readonly catalogsService: CatalogsService,
		protected readonly metatypesService: MetatypesService,
	) { }
	
	async findOne(apiKey: ApiKeys, id: number) {
		const entity = await this.catalogMetatypesService.findById(id);
		if(entity===null){
			throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
		}
		await this.validateRead(entity, apiKey, id);
		return entity;
	}
	
	async validateRead(entity, apiKey: ApiKeys, id: number) { }
	
	async create(apiKey: ApiKeys, createDto: CreateCatalogMetatypeDto) {
		createDto.id = id;
		return await this.catalogMetatypesService.transactional(async (em) => {
			const existed0 = await this.catalogMetatypesService.findByCatalogAndMetatype(createDto.catalog, createDto.metatype, em);
			if(existed0!==null){
				throw new HttpException('Duplicate (catalog, metatype)', HttpStatus.CONFLICT);
			}
			const tmp0 = await this.metatypesService.findById(createDto.metatype, em);
			if(tmp0===null){
				throw new HttpException('Not found contrainst (metatype)', HttpStatus.CONFLICT);
			}
			const tmp1 = await this.catalogsService.findById(createDto.catalog, em);
			if(tmp1===null){
				throw new HttpException('Not found contrainst (catalog)', HttpStatus.CONFLICT);
			}
			await this.validateCreate(apiKey, createDto, em);
			return await this.catalogMetatypesService.create(createDto, em);
		});
	}
	
	async validateCreate(apiKey: ApiKeys, createDto: CreateCatalogMetatypeDto, em: EntityManager) { }
	
	async update(apiKey: ApiKeys, id: number, updateDto: UpdateCatalogMetatypeDto) {
		return await this.catalogMetatypesService.transactional(async (em) => {
			const entity = await this.catalogMetatypesService.findById(id, em);
			if((updateDto.metatype!==undefined && updateDto.metatype!==entity.metatype.id)){
				const tmp2 = await this.metatypesService.findById(updateDto.metatype, em);
				if(tmp2===null){
					throw new HttpException('Not found contrainst (metatype)', HttpStatus.CONFLICT);
				}
			}
			if((updateDto.catalog!==undefined && updateDto.catalog!==entity.catalog.id)){
				const tmp3 = await this.catalogsService.findById(updateDto.catalog, em);
				if(tmp3===null){
					throw new HttpException('Not found contrainst (catalog)', HttpStatus.CONFLICT);
				}
			}
			if(entity===null){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			if((updateDto.catalog!==undefined && updateDto.catalog!==entity.catalog.id) || (updateDto.metatype!==undefined && updateDto.metatype!==entity.metatype.id)){
				const existed0 = await this.catalogMetatypesService.findByCatalogAndMetatype(updateDto.catalog, updateDto.metatype, em);
				if(existed0!==null && (entity.id !== existed0.id)){
					throw new HttpException('Duplicate (catalog, metatype)', HttpStatus.CONFLICT);
				}
			}
			this.validateUpdate(entity, apiKey, id, updateDto, em);
			return await this.catalogMetatypesService.update(entity, updateDto, em);
		});
	}
	
	async validateUpdate(entity, apiKey: ApiKeys, id: number, updateDto: UpdateCatalogMetatypeDto, em: EntityManager) { }
	
	async delete(apiKey: ApiKeys, id: number) {
		return await this.catalogMetatypesService.transactional(async (em) => {
			const entity = await this.catalogMetatypesService.findById(id, em);
			if(entity===null){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			await this.validateDelete(entity, apiKey, id, em);
			return await this.catalogMetatypesService.remove(entity, em);
		});
	}
	
	async validateDelete(entity, apiKey: ApiKeys, id: number, em: EntityManager) { }
	
}