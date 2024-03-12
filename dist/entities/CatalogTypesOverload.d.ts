import { PrimaryKeyProp } from '@mikro-orm/core';
import { CatalogTypes } from './CatalogTypes';
export declare class CatalogTypesOverload {
    [PrimaryKeyProp]?: ['prent', 'child'];
    prent: CatalogTypes;
    child: CatalogTypes;
    delta: number;
}
