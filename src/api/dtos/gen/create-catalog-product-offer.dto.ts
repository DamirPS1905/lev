import { ApiProperty } from '@nestjs/swagger'
import { Transform, TransformFnParams } from 'class-transformer'
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'

export class GenCreateCatalogProductOfferDto {
	
	@IsOptional()
	@ApiProperty({ required: false })
	product:bigint;
	
	catalog:number;
	
	@IsNotEmpty()
	@ApiProperty()
	@IsString()
	@Transform(({ value }: TransformFnParams) => value?.trim())
	@MinLength(1)
	@MaxLength(255)
	article:string;
	
}