import { CatalogProducts } from './CatalogProducts';
import { Catalogs } from './Catalogs';
export declare class CatalogProductOffers {
    id: bigint;
    product: CatalogProducts;
    catalog: Catalogs;
    article: string;
    created: Date;
}
