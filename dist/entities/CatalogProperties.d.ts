import { Opt } from '@mikro-orm/core';
import { PropertyTypes } from './PropertyTypes';
export declare class CatalogProperties {
    id: number;
    catalog: number;
    title: string;
    type: PropertyTypes;
    multiple: boolean & Opt;
    options: boolean & Opt;
}
