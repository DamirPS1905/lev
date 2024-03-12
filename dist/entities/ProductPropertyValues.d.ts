import { PrimaryKeyProp } from '@mikro-orm/core';
import { CatalogProducts } from './CatalogProducts';
import { CatalogProperties } from './CatalogProperties';
export declare class ProductPropertyValues {
    [PrimaryKeyProp]?: ['product', 'property'];
    product: CatalogProducts;
    property: CatalogProperties;
    value: any;
}
