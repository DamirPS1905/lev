import { AuthInfo } from './../../decorators/auth.decorator';
import { Actors } from './../../entities/Actors';
import { CreateInstanceVersionDto } from './../dtos/create-instance-version.dto';
import { UpdateInstanceVersionDto } from './../dtos/update-instance-version.dto';
import { InstanceVersionsService } from './../services/instance-versions.service';
import { GenInstanceVersionsController } from './gen/instance-versions.controller';
import { EntityManager } from '@mikro-orm/postgresql';
import { DefaultValuePipe, Get, ParseIntPipe, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiQuery } from '@nestjs/swagger';

export class InstanceVersionsController extends GenInstanceVersionsController {
	
	@Get('all')
	@ApiQuery({name: 'limit', description: 'Maximum count of returning entities', required: false})
	@ApiQuery({ name: 'offset', description: 'Count of skipping entities', required: false})
	async findAll(@AuthInfo() actor: Actors, @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number, @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number) {
		return await super.findAll(actor, offset, limit);
	}
	
	
}