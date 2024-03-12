import { CreateActorTypeDto } from './../../dtos/create-actor-type.dto'
import { UpdateActorTypeDto } from './../../dtos/update-actor-type.dto'
import { ActorTypesService } from './../../services/actor-types.service'
import { EntityManager } from '@mikro-orm/postgresql'
import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Post } from '@nestjs/common'
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger'

@ApiTags('Actor types')
@Controller('catalog/:catalog/actor-type')
export class GenActorTypesController {
	constructor(
		protected readonly actorTypesService: ActorTypesService,
	) { }
	
	@Get(':id')
	async findOne(@Param('id', ParseIntPipe) id: number) {
		const entity = await this.actorTypesService.findById(id);
		if(entity===null){
			throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
		}
		this.validateRead(entity, id);
		return entity;
	}
	
	@ApiExcludeEndpoint() validateRead(entity, id: number) { }
	
	@Post()
	async create(@Body() createDto: CreateActorTypeDto) {
		createDto.id = id;
		return await this.actorTypesService.transactional(async (em) => {
			const existed0 = await this.actorTypesService.findByTitle(createDto.title, em);
			if(existed0!==null){
				throw new HttpException('Duplicate (title)', HttpStatus.CONFLICT);
			}
			this.validateCreate(createDto, em);
			return await this.actorTypesService.create(createDto, em);
		});
	}
	
	@ApiExcludeEndpoint() validateCreate(createDto: CreateActorTypeDto, em: EntityManager) { }
	
	@Patch(':id')
	async update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateActorTypeDto) {
		updateDto.id = id;
		return await this.actorTypesService.transactional(async (em) => {
			const entity = await this.actorTypesService.findById(id, em);
			if(entity===null){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			const existed0 = await this.actorTypesService.findByTitle(updateDto.title, em);
			if(existed0!==null || (entity.id !== existed0.id)){
				throw new HttpException('Duplicate (title)', HttpStatus.CONFLICT);
			}
			this.validateUpdate(entity, id, updateDto, em);
			return await this.actorTypesService.update(entity, updateDto, em);
		});
	}
	
	@ApiExcludeEndpoint() validateUpdate(entity, id: number, updateDto: UpdateActorTypeDto, em: EntityManager) { }
	
	@Delete(':id')
	async delete(@Param('id', ParseIntPipe) id: number) {
		return await this.actorTypesService.transactional(async (em) => {
			const entity = await this.actorTypesService.findById(id, em);
			if(entity===null){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			this.validateDelete(entity, id, em);
			return await this.actorTypesService.remove(entity, em);
		});
	}
	
	@ApiExcludeEndpoint() validateDelete(entity, id: number, em: EntityManager) { }
	
}