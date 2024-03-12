import { ApiProperty } from '@nestjs/swagger'
import { Transform, TransformFnParams } from 'class-transformer'
import { IsInt, IsOptional, IsString } from 'class-validator'

export class GenCreateApiKeyDto {
	
	@IsOptional()
	@ApiProperty({ required: false })
	@IsInt()
	id:number;
	
	@IsOptional()
	@ApiProperty({ required: false })
	@IsString()
	@Transform(({ value }: TransformFnParams) => value?.trim())
	key:string;
	
	@IsOptional()
	@ApiProperty({ required: false })
	@IsInt()
	company:number;
	
	@IsOptional()
	@ApiProperty({ required: false })
	disposed:boolean;
	
	@IsOptional()
	@ApiProperty({ required: false })
	createdAt:Date;
	
	@IsOptional()
	@ApiProperty({ required: false })
	disposedAt:Date;
	
	@IsOptional()
	@ApiProperty({ required: false })
	@IsInt()
	actor:number;
	
}