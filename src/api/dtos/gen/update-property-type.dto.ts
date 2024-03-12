import { ApiProperty } from '@nestjs/swagger'
import { Transform, TransformFnParams } from 'class-transformer'
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator'

export class GenUpdatePropertyTypeDto {
	
	@IsOptional()
	@ApiProperty({ required: false })
	@IsString()
	@Transform(({ value }: TransformFnParams) => value?.trim())
	@MinLength(1)
	@MaxLength(255)
	title:string;
	
	@IsOptional()
	@ApiProperty({ required: false })
	scheme:any;
	
	catalog:number;
	
}