/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/dtos/update-offer-property-value.dto
 * in a proper way.
 */
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class GenUpdateOfferPropertyValueDto {
	
	offer:bigint;
	
	property:number;
	
	@IsNotEmpty()
	@ApiProperty()
	value:any;
	
}