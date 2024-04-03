/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/dtos/create-unit.dto
 * in a proper way.
 */
import { ApiProperty } from '@nestjs/swagger'
import { Transform, TransformFnParams } from 'class-transformer'
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class GenCreateUnitDto {
	
	company:number;
	
	@IsNotEmpty()
	@ApiProperty()
	@IsString()
	@Transform(({ value }: TransformFnParams) => value?.trim())
	title:string;
	
	@IsNotEmpty()
	@ApiProperty()
	@IsString()
	@Transform(({ value }: TransformFnParams) => value?.trim())
	abbr:string;
	
	@IsNotEmpty()
	@ApiProperty()
	@IsInt()
	group:number;
	
	@IsOptional()
	@ApiProperty({ required: false })
	@IsString()
	@Transform(({ value }: TransformFnParams) => value?.trim())
	add:string;
	
	@IsOptional()
	@ApiProperty({ required: false })
	@IsString()
	@Transform(({ value }: TransformFnParams) => value?.trim())
	factor:string;
	
}