import { Test, TestingModule } from '@nestjs/testing';
import { CatalogBrandsController } from './catalog-brands.controller';
import { CatalogBrandsService } from './catalog-brands.service';

describe('CatalogBrandsController', () => {
  let controller: CatalogBrandsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatalogBrandsController],
      providers: [CatalogBrandsService],
    }).compile();

    controller = module.get<CatalogBrandsController>(CatalogBrandsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
