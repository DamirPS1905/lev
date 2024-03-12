import { Catalogs } from './Catalogs';
export declare class CatalogTypes {
    id: number;
    catalog: Catalogs;
    title: string;
    parent?: CatalogTypes;
    root: boolean;
    level: number;
}
