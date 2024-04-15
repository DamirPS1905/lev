/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/dtos/update-unit-group.dto
 * in a proper way.
 */
import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class GenUpdateUnitGroupDto {
	
	@IsOptional()
	@ApiProperty({ required: false, description: 'Наименование группы единиц измерений; должно быть уникально среди доступных' })
	@IsString()
	@Transform(({ value }: TransformFnParams) => value?.trim())
	title:string;
	
	@IsOptional()
	@ApiProperty({ required: false, description: 'Описание группы единиц измерений' })
	@IsString()
	@Transform(({ value }: TransformFnParams) => value?.trim())
	description:string;
	
	@IsOptional()
	@ApiProperty({ required: false, description: 'Базовая единица измерения, относительно котрой указываются коэффициенты пересчета в данной группе единиц измерения' })
	@IsInt()
	base:number;
	
}