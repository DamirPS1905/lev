import { PrimaryKeyProp } from '@mikro-orm/core';
import { CatalogProductOffers } from './CatalogProductOffers';
import { CatalogProperties } from './CatalogProperties';
export declare class OfferPropertyValues {
    [PrimaryKeyProp]?: ['offer', 'property'];
    offer: CatalogProductOffers;
    property: CatalogProperties;
    value: any;
}
