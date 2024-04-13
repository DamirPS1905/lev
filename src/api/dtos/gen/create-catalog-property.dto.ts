/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/dtos/create-catalog-property.dto
 * in a proper way.
 */
import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class GenCreateCatalogPropertyDto {
	
	catalog:number;
	
	@IsNotEmpty()
	@ApiProperty()
	@IsString()
	@Transform(({ value }: TransformFnParams) => value?.trim())
	@MinLength(1)
	@MaxLength(255)
	title:string;
	
	@IsNotEmpty()
	@ApiProperty()
	@IsInt()
	type:number;
	
	@IsOptional()
	@ApiProperty({ required: false })
	multiple:boolean;
	
	@IsOptional()
	@ApiProperty({ required: false })
	options:boolean;
	
	@IsOptional()
	@ApiProperty({ required: false })
	scheme:any;
	
}