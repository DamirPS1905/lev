import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class OfferAmountDto {
	
	offer:bigint;
	
	store:number;
	
	@IsNotEmpty()
	@ApiProperty({ description: 'Колиество товара в указанной единице имерения, или в единицах учета товара, если единица измереня не указана' })
	@IsString()
	@Transform(({ value }: TransformFnParams) => value?.trim())
	amount:string;
	
	@IsOptional()
	@ApiProperty({ description: 'Единица имерения количесвтва (из группы единиц учета товра)' })
	@IsInt()
	unit:number;
	
	
}