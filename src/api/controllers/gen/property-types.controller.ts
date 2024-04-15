/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/controllers/property-types.controller
 * in a proper way.
 */
import { AuthInfo } from './../../../decorators/auth.decorator';
import { Actors } from './../../../entities/Actors';
import { CreatePropertyTypeDto } from './../../dtos/create-property-type.dto';
import { UpdatePropertyTypeDto } from './../../dtos/update-property-type.dto';
import { CatalogsService } from './../../services/catalogs.service';
import { PropertyTypesService } from './../../services/property-types.service';
import { EntityManager } from '@mikro-orm/postgresql';
import { Controller, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiHeader, ApiTags } from '@nestjs/swagger';

@ApiHeader({ name: 'X-API-KEY', required: true, description: 'Ваш идентефикатор апи' })
@UseGuards(AuthGuard('api-key'))
@ApiTags('Property types')
@Controller('catalog/:catalog/property-type')
export class GenPropertyTypesController {
	constructor(
		protected readonly catalogsService: CatalogsService,
		protected readonly propertyTypesService: PropertyTypesService,
	) { }
	
	async findAll(actor: Actors, catalog: number) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===actor.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		return await this.propertyTypesService.findAllByCatalog(catalog);
	}
	
	async findOne(actor: Actors, catalog: number, id: number) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===actor.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		const entity = await this.propertyTypesService.findById(id);
		if(entity===null || !(entity.catalog===null || entity.catalog.id===catalog)){
			throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
		}
		await this.validateRead(entity, actor, catalog, id);
		return entity;
	}
	
	async validateRead(entity, actor: Actors, catalog: number, id: number) { }
	
}