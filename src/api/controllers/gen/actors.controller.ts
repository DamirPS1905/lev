import { CreateActorDto } from './../../dtos/create-actor.dto'
import { UpdateActorDto } from './../../dtos/update-actor.dto'
import { ActorsService } from './../../services/actors.service'
import { EntityManager } from '@mikro-orm/postgresql'
import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Post } from '@nestjs/common'
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger'

@ApiTags('Actors')
@Controller('catalog/:catalog/actor')
export class GenActorsController {
	constructor(
		protected readonly actorsService: ActorsService,
	) { }
	
	@Get(':id')
	async findOne(@Param('id', ParseIntPipe) id: number) {
		const entity = await this.actorsService.findById(id);
		if(entity===null){
			throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
		}
		this.validateRead(entity, id);
		return entity;
	}
	
	@ApiExcludeEndpoint() validateRead(entity, id: number) { }
	
	@Post()
	async create(@Body() createDto: CreateActorDto) {
		createDto.id = id;
		return await this.actorsService.transactional(async (em) => {
			const existed0 = await this.actorsService.findByTypeAndKey(createDto.type, createDto.key, em);
			if(existed0!==null){
				throw new HttpException('Duplicate (type, key)', HttpStatus.CONFLICT);
			}
			this.validateCreate(createDto, em);
			return await this.actorsService.create(createDto, em);
		});
	}
	
	@ApiExcludeEndpoint() validateCreate(createDto: CreateActorDto, em: EntityManager) { }
	
	@Patch(':id')
	async update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateActorDto) {
		updateDto.id = id;
		return await this.actorsService.transactional(async (em) => {
			const entity = await this.actorsService.findById(id, em);
			if(entity===null){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			const existed0 = await this.actorsService.findByTypeAndKey(updateDto.type, updateDto.key, em);
			if(existed0!==null || (entity.id !== existed0.id)){
				throw new HttpException('Duplicate (type, key)', HttpStatus.CONFLICT);
			}
			this.validateUpdate(entity, id, updateDto, em);
			return await this.actorsService.update(entity, updateDto, em);
		});
	}
	
	@ApiExcludeEndpoint() validateUpdate(entity, id: number, updateDto: UpdateActorDto, em: EntityManager) { }
	
	@Delete(':id')
	async delete(@Param('id', ParseIntPipe) id: number) {
		return await this.actorsService.transactional(async (em) => {
			const entity = await this.actorsService.findById(id, em);
			if(entity===null){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			this.validateDelete(entity, id, em);
			return await this.actorsService.remove(entity, em);
		});
	}
	
	@ApiExcludeEndpoint() validateDelete(entity, id: number, em: EntityManager) { }
	
}