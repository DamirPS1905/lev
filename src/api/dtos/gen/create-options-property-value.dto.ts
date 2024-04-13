/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/dtos/create-options-property-value.dto
 * in a proper way.
 */
import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GenCreateOptionsPropertyValueDto {
	
	@IsOptional()
	@ApiProperty({ required: false })
	@IsInt()
	property:number;
	
	@IsNotEmpty()
	@ApiProperty()
	value:bigint;
	
	@IsOptional()
	@ApiProperty({ required: false })
	@IsString()
	@Transform(({ value }: TransformFnParams) => value?.trim())
	hash:string;
	
}