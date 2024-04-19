/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/dtos/create-file-load-task.dto
 * in a proper way.
 */
import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class GenCreateFileLoadTaskDto {
	
	@IsOptional()
	@ApiProperty({ required: false })
	@IsString()
	@Transform(({ value }: TransformFnParams) => value?.trim())
	url:string;
	
	@IsOptional()
	@ApiProperty({ required: false })
	processed:boolean;
	
	@IsOptional()
	@ApiProperty({ required: false })
	loaded:boolean;
	
	@IsOptional()
	@ApiProperty({ required: false })
	@IsString()
	@Transform(({ value }: TransformFnParams) => value?.trim())
	key:string;
	
	@IsOptional()
	@ApiProperty({ required: false })
	@IsString()
	@Transform(({ value }: TransformFnParams) => value?.trim())
	error:string;
	
	@IsOptional()
	@ApiProperty({ required: false })
	asImage:boolean;
	
	company:number;
	
}