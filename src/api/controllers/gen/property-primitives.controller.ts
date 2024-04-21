/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/controllers/property-primitives.controller
 * in a proper way.
 */
import { AuthInfo } from './../../../decorators/auth.decorator';
import { Actors } from './../../../entities/Actors';
import { CreatePropertyPrimitiveDto } from './../../dtos/create-property-primitive.dto';
import { UpdatePropertyPrimitiveDto } from './../../dtos/update-property-primitive.dto';
import { PropertyPrimitivesService } from './../../services/property-primitives.service';
import { FsPatch } from './../../services/special/files.service';
import { EntityManager } from '@mikro-orm/postgresql';
import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiHeader, ApiTags } from '@nestjs/swagger';

@ApiHeader({ name: 'X-API-KEY', required: true, description: 'Ваш идентефикатор апи' })
@UseGuards(AuthGuard('api-key'))
@ApiTags('Property primitives')
@Controller('property-primitive')
export class GenPropertyPrimitivesController {
	constructor(
		protected readonly propertyPrimitivesService: PropertyPrimitivesService,
	) { }
	
	async findAll(actor: Actors) {
		return await this.propertyPrimitivesService.findAll();
	}
	
}