/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/dtos/update-rates-history.dto
 * in a proper way.
 */
import { ApiProperty } from '@nestjs/swagger'
import { Transform, TransformFnParams } from 'class-transformer'
import { IsOptional, IsString } from 'class-validator'

export class GenUpdateRatesHistoryDto {
	
	from:number;
	
	to:number;
	
	source:number;
	
	date:string;
	
	@IsOptional()
	@ApiProperty({ required: false })
	@IsString()
	@Transform(({ value }: TransformFnParams) => value?.trim())
	rate:string;
	
}