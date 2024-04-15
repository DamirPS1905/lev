/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/dtos/create-catalog-metatype-property.dto
 * in a proper way.
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class GenCreateCatalogMetatypePropertyDto {
	
	metatype:number;
	
	catalog:number;
	
	property:number;
	
	@IsOptional()
	@ApiProperty({ required: false, description: 'Настройка параметров свойства' })
	scheme:any;
	
}