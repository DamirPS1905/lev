import { Test, TestingModule } from '@nestjs/testing';
import { CatalogBrandsService } from './catalog-brands.service';

describe('CatalogBrandsService', () => {
  let service: CatalogBrandsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CatalogBrandsService],
    }).compile();

    service = module.get<CatalogBrandsService>(CatalogBrandsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
