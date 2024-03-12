import {
	IsString,
	IsNotEmpty,
	MinLength,
	MaxLength,
	IsOptional,
} from 'class-validator';
import {
	Transform,
	TransformFnParams
} from 'class-transformer';

export class UpdateCatalogBrandDto {
	@Transform(({ value }: TransformFnParams) => value?.trim())
	@IsOptional()
	@IsString()
	@MinLength(1, {
		message: "Название бренда не может быть пустым"
	})
	@MaxLength(255, {
		message: "Название бренда слишком длинное"
	})
	title: string;
	
	@IsOptional()
	@IsString()
	logo: string;
	
	@Transform(({ value }: TransformFnParams) => value?.trim())
	@IsOptional()
	@IsString()
	description: string;
	
}