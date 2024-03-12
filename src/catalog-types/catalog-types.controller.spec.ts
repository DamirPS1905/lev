import { Test, TestingModule } from '@nestjs/testing';
import { CatalogTypesController } from './catalog-types.controller';
import { CatalogTypesService } from './catalog-types.service';

describe('CatalogTypesController', () => {
  let controller: CatalogTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatalogTypesController],
      providers: [CatalogTypesService],
    }).compile();

    controller = module.get<CatalogTypesController>(CatalogTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
