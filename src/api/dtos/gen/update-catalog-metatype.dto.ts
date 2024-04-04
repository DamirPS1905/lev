/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/dtos/update-catalog-metatype.dto
 * in a proper way.
 */
import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsOptional } from 'class-validator'

export class GenUpdateCatalogMetatypeDto {
	
	@IsOptional()
	@ApiProperty({ required: false })
	@IsInt()
	metatype:number;
	
}