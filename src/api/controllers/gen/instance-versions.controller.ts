/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/controllers/instance-versions.controller
 * in a proper way.
 */
import { AuthInfo } from './../../../decorators/auth.decorator';
import { Actors } from './../../../entities/Actors';
import { CreateInstanceVersionDto } from './../../dtos/create-instance-version.dto';
import { UpdateInstanceVersionDto } from './../../dtos/update-instance-version.dto';
import { InstanceVersionsService } from './../../services/instance-versions.service';
import { EntityManager } from '@mikro-orm/postgresql';
import { Controller, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiHeader, ApiTags } from '@nestjs/swagger';

@ApiHeader({ name: 'X-API-KEY', required: true, description: 'Ваш идентефикатор апи' })
@UseGuards(AuthGuard('api-key'))
@ApiTags('Instance versions')
@Controller('instance-version')
export class GenInstanceVersionsController {
	constructor(
		protected readonly instanceVersionsService: InstanceVersionsService,
	) { }
	
	async findAll(actor: Actors, offset: number, limit: number) {
		if(offset<0) throw new HttpException('Wrong offset value', HttpStatus.BAD_REQUEST);
		if(limit<0) throw new HttpException('Wrong limit value', HttpStatus.BAD_REQUEST);
		if(limit>1000) limit = 1000;
		return await this.instanceVersionsService.listByCompany(actor.company.id, offset, limit);
	}
	
}