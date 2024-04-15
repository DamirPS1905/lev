import { AuthInfo } from './../../decorators/auth.decorator'
import { Actors } from './../../entities/Actors'
import { CreateUnitDto } from './../dtos/create-unit.dto'
import { UpdateUnitDto } from './../dtos/update-unit.dto'
import { UnitsService } from './../services/units.service'
import { GenUnitsController } from './gen/units.controller'
import { EntityManager } from '@mikro-orm/postgresql'
import { Body, DefaultValuePipe, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiOperation, ApiParam } from '@nestjs/swagger'

export class UnitsController extends GenUnitsController {
	
	@Get('all')
	@ApiOperation({summary: "Получение значений всех единиц имерения в группе"})
	@ApiParam({name: 'group', description: 'ID группы единиц измерения'})
	async findAll(@AuthInfo() actor: Actors, @Param('group', ParseIntPipe) group: number) {
		const groupIns = await this.unitGroupsService.findById(group);
		if(groupIns===null || !(groupIns.company===null || groupIns.company.id===actor.company.id)){
			throw new HttpException('Units group not found', HttpStatus.NOT_FOUND);
		}
		return await this.unitsService.findAllByGroupAndCompany(group, actor.company.id);
	}
	
	@Get(':id')
	@ApiOperation({summary: "Получение единицы измерения"})
	@ApiParam({name: 'group', description: 'ID группы единиц измерения'})
	@ApiParam({name: 'id', description: 'ID единицы измерения'})
	async findOne(@AuthInfo() actor: Actors, @Param('group', ParseIntPipe) group: number, @Param('id', ParseIntPipe) id: number) {
		return await super.findOne(actor, group, id);
	}
	
	@Post()
	@ApiOperation({summary: "Создание новой единицы измерения"})
	@ApiParam({name: 'group', description: 'ID группы единиц измерения'})
	async create(@AuthInfo() actor: Actors, @Param('group', ParseIntPipe) group: number, @Body() createDto: CreateUnitDto) {
		return await super.create(actor, group, createDto);
	}
	
	@Patch(':id')
	@ApiOperation({summary: "Обновление параметров единицы измерения"})
	@ApiParam({name: 'group', description: 'ID группы единиц измерения'})
	@ApiParam({name: 'id', description: 'ID единицы измерения'})
	async update(@AuthInfo() actor: Actors, @Param('group', ParseIntPipe) group: number, @Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateUnitDto) {
		return await super.update(actor, group, id, updateDto);
	}
	
	@Delete(':id')
	@ApiOperation({summary: "Удаление единицы измерения"})
	@ApiParam({name: 'group', description: 'ID группы единиц измерения'})
	@ApiParam({name: 'id', description: 'ID единицы измерения'})
	async delete(@AuthInfo() actor: Actors, @Param('group', ParseIntPipe) group: number, @Param('id', ParseIntPipe) id: number) {
		return await super.delete(actor, group, id);
	}
	
	async validateCreate(actor: Actors, group: number, createDto: CreateUnitDto, em: EntityManager) {
		if(createDto.factor===0){
			throw new HttpException('Factor cannot be equal to zero', HttpStatus.CONFLICT);			
		}
		const existedCommonT = await this.unitsService.findCommonByGroupAndTitle(group, createDto.title);
		if(existedCommonT!==null){
			throw new HttpException('Unit with the same title already exists', HttpStatus.CONFLICT);
		}
		const existedMyT = await this.unitsService.findByGroupAndCompanyAndTitle(group, actor.company.id, createDto.title);
		if(existedMyT!==null){
			throw new HttpException('Unit with the same title already exists', HttpStatus.CONFLICT);
		}
		const existedCommonA = await this.unitsService.findCommonByGroupAndAbbr(group, createDto.abbr);
		if(existedCommonA!==null){
			throw new HttpException('Unit with the same abbreviation already exists', HttpStatus.CONFLICT);
		}
		const existedMyA = await this.unitsService.findByGroupAndCompanyAndAbbr(group, actor.company.id, createDto.abbr);
		if(existedMyA!==null){
			throw new HttpException('Unit with the same abbreviation already exists', HttpStatus.CONFLICT);
		}
	}
	
	async validateUpdate(entity, actor: Actors, group: number, id: number, updateDto: UpdateUnitDto, em: EntityManager) {
		if(updateDto.factor===0){
			throw new HttpException('Factor cannot be equal to zero', HttpStatus.CONFLICT);			
		}
		if(updateDto.title!==undefined && (updateDto.title!==entity.title)){
			const existedCommonT = await this.unitsService.findCommonByGroupAndTitle(group, updateDto.title);
			if(existedCommonT!==null && (existedCommonT.id!==entity.id)){
				throw new HttpException('Unit with the same title already exists', HttpStatus.CONFLICT);
			}
			const existedMyT = await this.unitsService.findByGroupAndCompanyAndTitle(group, actor.company.id, updateDto.title);
			if(existedMyT!==null && (existedMyT.id!==entity.id)){
				throw new HttpException('Unit with the same title already exists', HttpStatus.CONFLICT);
			}
		}
		if(updateDto.abbr!==undefined && (updateDto.abbr!==entity.abbr)){
			const existedCommonA = await this.unitsService.findCommonByGroupAndAbbr(group, updateDto.abbr);
			if(existedCommonA!==null && (existedCommonA.id!==entity.id)){
				throw new HttpException('Unit with the same abbreviation already exists', HttpStatus.CONFLICT);
			}
			const existedMyA = await this.unitsService.findByGroupAndCompanyAndAbbr(group, actor.company.id, updateDto.abbr);
			if(existedMyA!==null && (existedMyA.id!==entity.id)){
				throw new HttpException('Unit with the same abbreviation already exists', HttpStatus.CONFLICT);
			}
		}
	}

	
}