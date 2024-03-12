import { ApiProperty } from '@nestjs/swagger'
import { Transform, TransformFnParams } from 'class-transformer'
import { IsInt, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'

export class GenUpdateCatalogPropertyDto {
	
	catalog:number;
	
	@IsOptional()
	@ApiProperty({ required: false })
	@IsString()
	@Transform(({ value }: TransformFnParams) => value?.trim())
	@MinLength(1)
	@MaxLength(255)
	title:string;
	
	@IsOptional()
	@ApiProperty({ required: false })
	@IsInt()
	type:number;
	
	@IsOptional()
	@ApiProperty({ required: false })
	multiple:boolean;
	
	@IsOptional()
	@ApiProperty({ required: false })
	options:boolean;
	
}