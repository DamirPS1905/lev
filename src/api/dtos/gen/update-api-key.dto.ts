/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/dtos/update-api-key.dto
 * in a proper way.
 */
import { ApiProperty } from '@nestjs/swagger'
import { Transform, TransformFnParams } from 'class-transformer'
import { IsInt, IsOptional, IsString } from 'class-validator'

export class GenUpdateApiKeyDto {
	
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