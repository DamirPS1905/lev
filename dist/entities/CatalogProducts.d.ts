import { CatalogBrands } from './CatalogBrands';
import { CatalogTypes } from './CatalogTypes';
import { Catalogs } from './Catalogs';
export declare class CatalogProducts {
    id: bigint;
    catalog: Catalogs;
    type: CatalogTypes;
    brand: CatalogBrands;
    title: string;
    created: Date;
}
