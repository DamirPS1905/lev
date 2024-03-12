import {
	IsInt,
	IsString,
	IsNotEmpty,
	MinLength,
	Min,
	MaxLength,
	IsOptional,
} from 'class-validator';
import {
	Transform,
	TransformFnParams
} from 'class-transformer';

export class UpdateCatalogTypeDto {

	@Transform(({ value }: TransformFnParams) => value?.trim())
	@IsOptional()
	@IsString()
	@MinLength(1, {
		message: "Название типа не может быть пустым"
	})
	@MaxLength(255, {
		message: "Название типа слишком длинное"
	})
	title: string;
	
	@IsOptional()
	@IsInt()
	@Min(0)
	parent: number;
			
	level: number;
	
}
