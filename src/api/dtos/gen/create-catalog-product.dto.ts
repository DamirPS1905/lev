/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/dtos/create-catalog-product.dto
 * in a proper way.
 */
import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class GenCreateCatalogProductDto {
	
	catalog:number;
	
	@IsNotEmpty()
	@ApiProperty()
	@IsInt()
	type:number;
	
	@IsNotEmpty()
	@ApiProperty()
	@IsInt()
	brand:number;
	
	@IsNotEmpty()
	@ApiProperty()
	@IsString()
	@Transform(({ value }: TransformFnParams) => value?.trim())
	@MinLength(1)
	@MaxLength(255)
	title:string;
	
	@IsOptional()
	@ApiProperty({ required: false })
	@IsInt()
	collection:number;
	
}