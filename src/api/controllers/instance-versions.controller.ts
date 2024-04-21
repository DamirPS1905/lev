import { AuthInfo } from './../../decorators/auth.decorator';
import { Actors } from './../../entities/Actors';
import { CreateInstanceVersionDto } from './../dtos/create-instance-version.dto';
import { UpdateInstanceVersionDto } from './../dtos/update-instance-version.dto';
import { InstanceVersionsService } from './../services/instance-versions.service';
import { EntityManager } from '@mikro-orm/postgresql';
import { Controller, HttpException, HttpStatus, UseGuards, DefaultValuePipe, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiHeader, ApiTags, ApiQuery, ApiParam } from '@nestjs/swagger';
import { ParseBigIntPipe } from './../../pipes/parse-bigint.pipe'

@ApiHeader({ name: 'X-API-KEY', required: true, description: 'Ваш идентефикатор апи' })
@UseGuards(AuthGuard('api-key'))
@ApiTags('Instance versions')
@Controller('instance-version')
export class InstanceVersionsController {
	
	constructor(
		protected readonly instanceVersionsService: InstanceVersionsService,
	) { }
	
	@Get('all-from/:version')
	@ApiParam({name: 'version', description: 'Последняя версия, полученная при последнем регулярном обращении'})
	@ApiQuery({name: 'limit', description: 'Maximum count of returning entities', required: false})
	async findAll(@AuthInfo() actor: Actors, @Param('version', ParseBigIntPipe) version: bigint, @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number) {
		if(limit<0) throw new HttpException('Wrong limit value', HttpStatus.BAD_REQUEST);
		if(limit>1000) limit = 1000;
		return await this.instanceVersionsService.newByCompanyAndVersion(actor.company.id, version, limit);
	}
	
	
}