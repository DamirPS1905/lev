/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/dtos/create-actor-type.dto
 * in a proper way.
 */
import { ApiProperty } from '@nestjs/swagger'
import { Transform, TransformFnParams } from 'class-transformer'
import { IsInt, IsOptional, IsString } from 'class-validator'

export class GenCreateActorTypeDto {
	
	@IsOptional()
	@ApiProperty({ required: false })
	@IsInt()
	id:number;
	
	@IsOptional()
	@ApiProperty({ required: false })
	@IsString()
	@Transform(({ value }: TransformFnParams) => value?.trim())
	title:string;
	
}