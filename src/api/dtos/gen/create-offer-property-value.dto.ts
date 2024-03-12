import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class GenCreateOfferPropertyValueDto {
	
	offer:bigint;
	
	property:number;
	
	@IsNotEmpty()
	@ApiProperty()
	value:any;
	
}