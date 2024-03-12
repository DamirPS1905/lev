import { ApiProperty } from '@nestjs/swagger'
import { Transform, TransformFnParams } from 'class-transformer'
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class GenUpdateOptionsPropertyValueDto {
	
	@IsOptional()
	@ApiProperty({ required: false })
	@IsInt()
	property:number;
	
	@IsNotEmpty()
	@ApiProperty()
	value:any;
	
	@IsOptional()
	@ApiProperty({ required: false })
	@IsString()
	@Transform(({ value }: TransformFnParams) => value?.trim())
	hash:string;
	
}