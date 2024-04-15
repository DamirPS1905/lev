/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/dtos/update-unit.dto
 * in a proper way.
 */
import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GenUpdateUnitDto {
	
	@IsOptional()
	@ApiProperty({ required: false, description: 'Наименование единицы измерения; должно быть уникально в его группе единиц измерения' })
	@IsString()
	@Transform(({ value }: TransformFnParams) => value?.trim())
	title:string;
	
	@IsOptional()
	@ApiProperty({ required: false, description: 'Аббревиатура единицы измерения; должно быть уникально в его группе единиц измерения' })
	@IsString()
	@Transform(({ value }: TransformFnParams) => value?.trim())
	abbr:string;
	
	@IsOptional()
	@ApiProperty({ required: false, description: 'Добавочный коэффициент для пересчета из базовой единицы измерения группы' })
	@IsNumber()
	add:number;
	
	@IsOptional()
	@ApiProperty({ required: false, description: 'Множитель для пересчета из базовой единицы измерения группы' })
	@IsNumber()
	factor:number;
	
}