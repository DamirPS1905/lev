import { AuthInfo } from './../../decorators/auth.decorator'
import { ApiKeys } from './../../entities/ApiKeys'
import { CreateUnitGroupDto } from './../dtos/create-unit-group.dto'
import { UpdateUnitGroupDto } from './../dtos/update-unit-group.dto'
import { UnitGroupsService } from './../services/unit-groups.service'
import { GenUnitGroupsController } from './gen/unit-groups.controller'
import { EntityManager } from '@mikro-orm/postgresql'
import { Body, DefaultValuePipe, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

export class UnitGroupsController extends GenUnitGroupsController {
	
	@Get('all')
	async findAll(@AuthInfo() apiKey: ApiKeys) {
		return await super.findAll(apiKey);
	}
	
	@Get(':id')
	async findOne(@AuthInfo() apiKey: ApiKeys, @Param('id', ParseIntPipe) id: number) {
		return await super.findOne(apiKey, id);
	}
	
	@Post()
	async create(@AuthInfo() apiKey: ApiKeys, @Body() createDto: CreateUnitGroupDto) {
		return await super.create(apiKey, createDto);
	}
	
	@Patch(':id')
	async update(@AuthInfo() apiKey: ApiKeys, @Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateUnitGroupDto) {
		return await super.update(apiKey, id, updateDto);
	}
	
	@Delete(':id')
	async delete(@AuthInfo() apiKey: ApiKeys, @Param('id', ParseIntPipe) id: number) {
		return await super.delete(apiKey, id);
	}

	async validateCreate(apiKey: ApiKeys, createDto: CreateUnitGroupDto, em: EntityManager) {
		const existedCommonT = await this.unitGroupsService.findCommonByTitle(createDto.title);
		if(existedCommonT!==null){
			throw new HttpException('Units group with the same title already exists', HttpStatus.CONFLICT);
		}
		const existedMyT = await this.unitGroupsService.findByCompanyAndTitle(apiKey.company.id, createDto.title);
		if(existedMyT!==null){
			throw new HttpException('Units group with the same title already exists', HttpStatus.CONFLICT);
		}
		/*const existedCommonA = await this.unitGroupsService.findCommonByAbbr(createDto.title);
		if(existedCommonA!==null){
			throw new HttpException('Units group with the same abbreviation already exists', HttpStatus.CONFLICT);
		}
		const existedMyA = await this.unitGroupsService.findByCompanyAndAbbr(apiKey.company.id, createDto.title);
		if(existedMyA!==null){
			throw new HttpException('Units group with the same abbreviation already exists', HttpStatus.CONFLICT);
		}*/
	}
	
	async validateUpdate(entity, apiKey: ApiKeys, id: number, updateDto: UpdateUnitGroupDto, em: EntityManager) {
		if(updateDto.title!==undefined && (updateDto.title!==entity.title)){
			const existedCommonT = await this.unitGroupsService.findCommonByTitle(updateDto.title);
			if(existedCommonT!==null && (existedCommonT.id!==entity.id)){
				throw new HttpException('Units group with the same title already exists', HttpStatus.CONFLICT);
			}
			const existedMyT = await this.unitGroupsService.findByCompanyAndTitle(apiKey.company.id, updateDto.title);
			if(existedMyT!==null && (existedMyT.id!==entity.id)){
				throw new HttpException('Units group with the same title already exists', HttpStatus.CONFLICT);
			}
		}
		/*if(updateDto.abbr!==undefined && (updateDto.abbr!==entity.abbr)){
			const existedCommonA = await this.unitGroupsService.findCommonByAbbr(updateDto.title);
			if(existedCommonA!==null && (existedCommonA.id!==entity.id)){
				throw new HttpException('Units group with the same abbreviation already exists', HttpStatus.CONFLICT);
			}
			const existedMyA = await this.unitGroupsService.findByCompanyAndAbbr(apiKey.company.id, updateDto.title);
			if(existedMyA!==null && (existedMyA.id!==entity.id)){
				throw new HttpException('Units group with the same abbreviation already exists', HttpStatus.CONFLICT);
			}
		}*/
	}
	
}