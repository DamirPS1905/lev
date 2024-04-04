import { AuthInfo } from './../../decorators/auth.decorator'
import { ApiKeys } from './../../entities/ApiKeys'
import { CreateUnitDto } from './../dtos/create-unit.dto'
import { UpdateUnitDto } from './../dtos/update-unit.dto'
import { UnitsService } from './../services/units.service'
import { GenUnitsController } from './gen/units.controller'
import { EntityManager } from '@mikro-orm/postgresql'
import { Body, DefaultValuePipe, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

export class UnitsController extends GenUnitsController {
	
	@Get('all')
	async findAll(@AuthInfo() apiKey: ApiKeys, @Param('group', ParseIntPipe) group: number, @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number, @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number) {
		const groupIns = await this.unitGroupsService.findById(group);
		if(groupIns===null || !(groupIns.company===null || groupIns.company.id===apiKey.company.id)){
			throw new HttpException('Units group not found', HttpStatus.NOT_FOUND);
		}
		return await this.unitsService.listByGroupAndCompany(group, apiKey.company.id, offset, limit);
	}
	
	@Get(':id')
	async findOne(@AuthInfo() apiKey: ApiKeys, @Param('group', ParseIntPipe) group: number, @Param('id', ParseIntPipe) id: number) {
		return await super.findOne(apiKey, group, id);
	}
	
	@Post()
	async create(@AuthInfo() apiKey: ApiKeys, @Param('group', ParseIntPipe) group: number, @Body() createDto: CreateUnitDto) {
		return await super.create(apiKey, group, createDto);
	}
	
	@Patch(':id')
	async update(@AuthInfo() apiKey: ApiKeys, @Param('group', ParseIntPipe) group: number, @Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateUnitDto) {
		return await super.update(apiKey, group, id, updateDto);
	}
	
	@Delete(':id')
	async delete(@AuthInfo() apiKey: ApiKeys, @Param('group', ParseIntPipe) group: number, @Param('id', ParseIntPipe) id: number) {
		return await super.delete(apiKey, group, id);
	}
	
	async validateCreate(apiKey: ApiKeys, group: number, createDto: CreateUnitDto, em: EntityManager) {
		if(createDto.factor===0){
			throw new HttpException('Factor cannot be equal to zero', HttpStatus.CONFLICT);			
		}
		const existedCommonT = await this.unitsService.findCommonByGroupAndTitle(group, createDto.title);
		if(existedCommonT!==null){
			throw new HttpException('Unit with the same title already exists', HttpStatus.CONFLICT);
		}
		const existedMyT = await this.unitsService.findByGroupAndCompanyAndTitle(group, apiKey.company.id, createDto.title);
		if(existedMyT!==null){
			throw new HttpException('Unit with the same title already exists', HttpStatus.CONFLICT);
		}
		const existedCommonA = await this.unitsService.findCommonByGroupAndAbbr(group, createDto.abbr);
		if(existedCommonA!==null){
			throw new HttpException('Unit with the same abbreviation already exists', HttpStatus.CONFLICT);
		}
		const existedMyA = await this.unitsService.findByGroupAndCompanyAndAbbr(group, apiKey.company.id, createDto.abbr);
		if(existedMyA!==null){
			throw new HttpException('Unit with the same abbreviation already exists', HttpStatus.CONFLICT);
		}
	}
	
	async validateUpdate(entity, apiKey: ApiKeys, group: number, id: number, updateDto: UpdateUnitDto, em: EntityManager) {
		if(updateDto.factor===0){
			throw new HttpException('Factor cannot be equal to zero', HttpStatus.CONFLICT);			
		}
		if(updateDto.title!==undefined && (updateDto.title!==entity.title)){
			const existedCommonT = await this.unitsService.findCommonByGroupAndTitle(group, updateDto.title);
			if(existedCommonT!==null && (existedCommonT.id!==entity.id)){
				throw new HttpException('Unit with the same title already exists', HttpStatus.CONFLICT);
			}
			const existedMyT = await this.unitsService.findByGroupAndCompanyAndTitle(group, apiKey.company.id, updateDto.title);
			if(existedMyT!==null && (existedMyT.id!==entity.id)){
				throw new HttpException('Unit with the same title already exists', HttpStatus.CONFLICT);
			}
		}
		if(updateDto.abbr!==undefined && (updateDto.abbr!==entity.abbr)){
			const existedCommonA = await this.unitsService.findCommonByGroupAndAbbr(group, updateDto.abbr);
			if(existedCommonA!==null && (existedCommonA.id!==entity.id)){
				throw new HttpException('Unit with the same abbreviation already exists', HttpStatus.CONFLICT);
			}
			const existedMyA = await this.unitsService.findByGroupAndCompanyAndAbbr(group, apiKey.company.id, updateDto.abbr);
			if(existedMyA!==null && (existedMyA.id!==entity.id)){
				throw new HttpException('Unit with the same abbreviation already exists', HttpStatus.CONFLICT);
			}
		}
	}

	
}