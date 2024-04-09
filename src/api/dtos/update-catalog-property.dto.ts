import { GenUpdateCatalogPropertyDto } from './gen/update-catalog-property.dto';
import { PropertyTuningDto } from './property-tuning.dto'
import { ApiProperty, getSchemaPath } from '@nestjs/swagger'
import { IsOptional, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

export class UpdateCatalogPropertyDto extends GenUpdateCatalogPropertyDto {
	
	@IsOptional()
	@ApiProperty({ 
		required: false, 
		type: 'object',
	  additionalProperties: {
	  	$ref: getSchemaPath(PropertyTuningDto)
	  }
	})
	@ValidateNested({ each: true })
	@Type(() => PropertyTuningDto)
	scheme:Map<string, PropertyTuningDto>;
	
}