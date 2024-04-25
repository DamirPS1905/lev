import { GenUpdateCatalogMetatypePropertyDto } from './gen/update-catalog-metatype-property.dto';
import { PropertyTuningDto } from './property-tuning.dto';
import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';

export class UpdateCatalogMetatypePropertyDto extends GenUpdateCatalogMetatypePropertyDto {
	
	@IsOptional()
	@ApiExtraModels(PropertyTuningDto)
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