/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/controllers/rates.controller
 * in a proper way.
 */
import { AuthInfo } from './../../../decorators/auth.decorator'
import { ApiKeys } from './../../../entities/ApiKeys'
import { CreateRateDto } from './../../dtos/create-rate.dto'
import { UpdateRateDto } from './../../dtos/update-rate.dto'
import { RatesService } from './../../services/rates.service'
import { EntityManager } from '@mikro-orm/postgresql'
import { Controller, HttpException, HttpStatus, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiHeader, ApiTags } from '@nestjs/swagger'

@ApiHeader({ name: 'X-API-KEY', required: true })
@UseGuards(AuthGuard('api-key'))
@ApiTags('Rates')
@Controller('rate')
export class GenRatesController {
	constructor(
		protected readonly ratesService: RatesService,
	) { }
	
	async findAll(apiKey: ApiKeys, offset: number, limit: number) {
		if(offset<0) throw new HttpException('Wrong offset value', HttpStatus.BAD_REQUEST);
		if(limit<0) throw new HttpException('Wrong limit value', HttpStatus.BAD_REQUEST);
		if(limit>1000) limit = 1000; // throw new HttpException('Wrong limit value', HttpStatus.BAD_REQUEST);
		return await this.ratesService.listAll(offset, limit);
	}
	
	async findOne(apiKey: ApiKeys, from: number, to: number, source: number) {
		const entity = await this.ratesService.findByFromAndToAndSource(from, to, source);
		if(entity===null){
			throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
		}
		await this.validateRead(entity, apiKey, from, to, source);
		return entity;
	}
	
	async validateRead(entity, apiKey: ApiKeys, from: number, to: number, source: number) { }
	
}