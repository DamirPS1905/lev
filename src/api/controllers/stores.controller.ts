import { AuthInfo } from './../../decorators/auth.decorator';
import { Actors } from './../../entities/Actors';
import { CreateStoreDto } from './../dtos/create-store.dto';
import { UpdateStoreDto } from './../dtos/update-store.dto';
import { InstanceTypesEnum } from './../enums/instance-types.enum';
import { FsPatch } from './../services/special/files.service';
import { StoresService } from './../services/stores.service';
import { GenStoresController } from './gen/stores.controller';
import { EntityManager } from '@mikro-orm/postgresql';
import { Body, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiParam } from '@nestjs/swagger';

export class StoresController extends GenStoresController {
	
	@Get('all')
	@ApiOperation({summary: "Получение информации о всех складах"})
	async findAll(@AuthInfo() actor: Actors) {
		return await super.findAll(actor);
	}
	
	@Get(':id')
	@ApiOperation({summary: "Получение информации о складе"})
	@ApiParam({name: 'id', description: 'ID склада'})
	async findOne(@AuthInfo() actor: Actors, @Param('id', ParseIntPipe) id: number) {
		return await super.findOne(actor, id);
	}
	
	@Post()
	@ApiOperation({summary: "Создание нового склада"})
	async create(@AuthInfo() actor: Actors, @Body() createDto: CreateStoreDto) {
		return await super.create(actor, createDto);
	}
	
	async afterCreate(entity, actor: Actors, createDto: CreateStoreDto, em: EntityManager, fm: FsPatch) {
		await this.instanceVersionsService.upVersion(actor.company.id, 0, InstanceTypesEnum.Store, entity.id, em);
	}
	
	@Patch(':id')
	@ApiOperation({summary: "Обновление информации о существующем складе"})
	@ApiParam({name: 'id', description: 'ID склада'})
	async update(@AuthInfo() actor: Actors, @Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateStoreDto) {
		return await super.update(actor, id, updateDto);
	}
	
	async afterUpdate(entity, actor: Actors, id: number, updateDto: UpdateStoreDto, em: EntityManager, fm: FsPatch) {
		await this.instanceVersionsService.upVersion(actor.company.id, 0, InstanceTypesEnum.Store, entity.id, em);
	}
	
	@Delete(':id')
	@ApiOperation({summary: "Удадение существующего склада"})
	@ApiParam({name: 'id', description: 'ID склада'})
	async delete(@AuthInfo() actor: Actors, @Param('id', ParseIntPipe) id: number) {
		return await super.delete(actor, id);
	}
	
	async afterDelete(entity, actor: Actors, id: number, em: EntityManager, fm: FsPatch) {
		await this.instanceVersionsService.upDeleted(actor.company.id, 0, InstanceTypesEnum.Store, entity.id, em);
	}
	
}