/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/dtos/create-unit-group.dto
 * in a proper way.
 */
import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GenCreateUnitGroupDto {
	
	@IsNotEmpty()
	@ApiProperty({ description: 'Наименование группы единиц измерений; должно быть уникально среди доступных' })
	@IsString()
	@Transform(({ value }: TransformFnParams) => value?.trim())
	title:string;
	
	company:number;
	
	@IsOptional()
	@ApiProperty({ required: false, description: 'Описание группы единиц измерений' })
	@IsString()
	@Transform(({ value }: TransformFnParams) => value?.trim())
	description:string;
	
}