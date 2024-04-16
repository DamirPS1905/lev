/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/dtos/update-product-relation.dto
 * in a proper way.
 */
import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsInt, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class GenUpdateProductRelationDto {
	
	@IsOptional()
	@ApiProperty({ required: false, description: 'Наименование типа взаимоотношений' })
	@IsString()
	@Transform(({ value }: TransformFnParams) => value?.trim())
	@MinLength(1)
	@MaxLength(255)
	title:string;
	
	@IsOptional()
	@ApiProperty({ required: false, description: 'Вид взаимоотношений' })
	@IsInt()
	kind:number;
	
	@IsOptional()
	@ApiProperty({ required: false, description: 'Является ли взаимоотношение симметричным' })
	symmetric:boolean;
	
}