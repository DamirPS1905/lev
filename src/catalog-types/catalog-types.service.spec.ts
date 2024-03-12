import { Test, TestingModule } from '@nestjs/testing';
import { CatalogTypesService } from './catalog-types.service';

describe('CatalogTypesService', () => {
  let service: CatalogTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CatalogTypesService],
    }).compile();

    service = module.get<CatalogTypesService>(CatalogTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
