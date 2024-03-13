/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/dtos/update-catalog-types-overload.dto
 * in a proper way.
 */
import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsOptional } from 'class-validator'

export class GenUpdateCatalogTypesOverloadDto {
	
	@IsOptional()
	@ApiProperty({ required: false })
	@IsInt()
	parent:number;
	
	@IsOptional()
	@ApiProperty({ required: false })
	@IsInt()
	child:number;
	
	@IsOptional()
	@ApiProperty({ required: false })
	@IsInt()
	delta:number;
	
}