/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/controllers/metatypes.controller
 * in a proper way.
 */
import { AuthInfo } from './../../../decorators/auth.decorator';
import { ApiKeys } from './../../../entities/ApiKeys';
import { CreateMetatypeDto } from './../../dtos/create-metatype.dto';
import { UpdateMetatypeDto } from './../../dtos/update-metatype.dto';
import { MetatypesService } from './../../services/metatypes.service';
import { EntityManager } from '@mikro-orm/postgresql';
import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiHeader, ApiTags } from '@nestjs/swagger';

@ApiHeader({ name: 'X-API-KEY', required: true, description: 'Ваш идентефикатор апи' })
@UseGuards(AuthGuard('api-key'))
@ApiTags('Metatypes')
@Controller('metatype')
export class GenMetatypesController {
	constructor(
		protected readonly metatypesService: MetatypesService,
	) { }
	
	async findAll(apiKey: ApiKeys) {
		return await this.metatypesService.findAll();
	}
	
}