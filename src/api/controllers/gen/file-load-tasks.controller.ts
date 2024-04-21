/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/controllers/file-load-tasks.controller
 * in a proper way.
 */
import { AuthInfo } from './../../../decorators/auth.decorator';
import { Actors } from './../../../entities/Actors';
import { CreateFileLoadTaskDto } from './../../dtos/create-file-load-task.dto';
import { UpdateFileLoadTaskDto } from './../../dtos/update-file-load-task.dto';
import { FileLoadTasksService } from './../../services/file-load-tasks.service';
import { FsPatch } from './../../services/special/files.service';
import { EntityManager } from '@mikro-orm/postgresql';
import { Controller, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiHeader, ApiTags } from '@nestjs/swagger';

@ApiHeader({ name: 'X-API-KEY', required: true, description: 'Ваш идентефикатор апи' })
@UseGuards(AuthGuard('api-key'))
@ApiTags('File load tasks')
@Controller('file-load-task')
export class GenFileLoadTasksController {
	constructor(
		protected readonly fileLoadTasksService: FileLoadTasksService,
	) { }
	
	async findAll(actor: Actors, offset: number, limit: number) {
		if(offset<0) throw new HttpException('Wrong offset value', HttpStatus.BAD_REQUEST);
		if(limit<0) throw new HttpException('Wrong limit value', HttpStatus.BAD_REQUEST);
		if(limit>1000) limit = 1000;
		return await this.fileLoadTasksService.listByCompany(actor.company.id, offset, limit);
	}
	
}