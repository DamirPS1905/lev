import { ApiProperty } from '@nestjs/swagger'
import { Transform, TransformFnParams } from 'class-transformer'
import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'

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
	
}