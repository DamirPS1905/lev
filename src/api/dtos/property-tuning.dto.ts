import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsUrl, IsOptional } from 'class-validator'

export class PropertyTuningDto {
	
	@IsOptional()
	@ApiProperty({ 
		required: false,
		oneOf: [
      { type: 'string' },
      { type: 'number' },
      { type: 'boolean' }
    ],
		description: 'Значение используемое по умолчанию, если значение части свойства не предоставлено'
	})
	defaultValue:number|string|boolean;
	
	@IsOptional()
	@IsInt()
	@ApiProperty({ required: false, description: 'Единица измерения, используемая по умолчанию, если в передаваемом значении она не задана (только для частей значений с единицами измерений)' })
	defaultUnit:number;
	
	@IsOptional()
	@IsInt()
	@ApiProperty({ required: false, description: 'Группа единиц имерения, в которых измеряется данная часть свойства (только для частей значений с единицами измерений)' })
	unitsGroup:number;
	
	@IsOptional()
	@IsInt()
	@ApiProperty({ required: false, description: 'Единица измерения в которой должно происходить сортировка и сравнение различных значений части свойства (только для частей значений с единицами измерений)' })
	storageUnit:number;
	
	@IsOptional()
	@IsInt()
	@ApiProperty({ required: false, description: 'Единица измерений, в которой должна отображаться данная часть знчения свойства (только для частей значений с единицами измерений)' })
	displayUnit:number;
	
}