import { AuthInfo } from './../../decorators/auth.decorator'
import { Actors } from './../../entities/Actors'
import { CreateUnitGroupDto } from './../dtos/create-unit-group.dto'
import { UpdateUnitGroupDto } from './../dtos/update-unit-group.dto'
import { UnitGroupsService } from './../services/unit-groups.service'
import { GenUnitGroupsController } from './gen/unit-groups.controller'
import { EntityManager } from '@mikro-orm/postgresql'
import { Body, DefaultValuePipe, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiOperation, ApiParam } from '@nestjs/swagger'

export class UnitGroupsController extends GenUnitGroupsController {
	
	@Get('all')
	@ApiOperation({summary: "Получение доступнвх групп единиц измерения"})
	async findAll(@AuthInfo() actor: Actors) {
		return await super.findAll(actor);
	}
	
	@Get(':id')
	@ApiOperation({summary: "Получение единицы измерения"})
	@ApiParam({name: 'id', description: 'ID группы единиц измерения'})
	async findOne(@AuthInfo() actor: Actors, @Param('id', ParseIntPipe) id: number) {
		return await super.findOne(actor, id);
	}
	
	@Post()
	@ApiOperation({summary: "Создание группы единиц измерения"})
	async create(@AuthInfo() actor: Actors, @Body() createDto: CreateUnitGroupDto) {
		return await super.create(actor, createDto);
	}
	
	@Patch(':id')
	@ApiOperation({summary: "Обновление параметров группы единиц измерения"})
	@ApiParam({name: 'id', description: 'ID группы единиц измерения'})
	async update(@AuthInfo() actor: Actors, @Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateUnitGroupDto) {
		return await super.update(actor, id, updateDto);
	}
	
	@Delete(':id')
	@ApiOperation({summary: "Удаление группы единиц измерения"})
	@ApiParam({name: 'id', description: 'ID группы единиц измерения'})
	async delete(@AuthInfo() actor: Actors, @Param('id', ParseIntPipe) id: number) {
		return await super.delete(actor, id);
	}

	async validateCreate(actor: Actors, createDto: CreateUnitGroupDto, em: EntityManager) {
		const existedCommonT = await this.unitGroupsService.findCommonByTitle(createDto.title);
		if(existedCommonT!==null){
			throw new HttpException('Units group with the same title already exists', HttpStatus.CONFLICT);
		}
		const existedMyT = await this.unitGroupsService.findByCompanyAndTitle(actor.company.id, createDto.title);
		if(existedMyT!==null){
			throw new HttpException('Units group with the same title already exists', HttpStatus.CONFLICT);
		}
	}
	
	async validateUpdate(entity, actor: Actors, id: number, updateDto: UpdateUnitGroupDto, em: EntityManager) {
		if(updateDto.title!==undefined && (updateDto.title!==entity.title)){
			const existedCommonT = await this.unitGroupsService.findCommonByTitle(updateDto.title);
			if(existedCommonT!==null && (existedCommonT.id!==entity.id)){
				throw new HttpException('Units group with the same title already exists', HttpStatus.CONFLICT);
			}
			const existedMyT = await this.unitGroupsService.findByCompanyAndTitle(actor.company.id, updateDto.title);
			if(existedMyT!==null && (existedMyT.id!==entity.id)){
				throw new HttpException('Units group with the same title already exists', HttpStatus.CONFLICT);
			}
		}
	}
	
}