/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/dtos/update-unit.dto
 * in a proper way.
 */
import { ApiProperty } from '@nestjs/swagger'
import { Transform, TransformFnParams } from 'class-transformer'
import { IsInt, IsOptional, IsString } from 'class-validator'

export class GenUpdateUnitDto {
	
	@IsOptional()
	@ApiProperty({ required: false })
	@IsString()
	@Transform(({ value }: TransformFnParams) => value?.trim())
	title:string;
	
	@IsOptional()
	@ApiProperty({ required: false })
	@IsString()
	@Transform(({ value }: TransformFnParams) => value?.trim())
	abbr:string;
	
	@IsOptional()
	@ApiProperty({ required: false })
	@IsInt()
	group:number;
	
	@IsOptional()
	@ApiProperty({ required: false })
	@IsInt()
	add:number;
	
	@IsOptional()
	@ApiProperty({ required: false })
	@IsInt()
	factor:number;
	
}