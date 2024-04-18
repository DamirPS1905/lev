import { GenOfferAmountsService } from './gen/offer-amounts.service'
import { Injectable } from '@nestjs/common'
import { EntityManager, wrap } from '@mikro-orm/postgresql';
import { OfferAmounts } from './../../entities/OfferAmounts';

@Injectable()
export class OfferAmountsService extends GenOfferAmountsService {
	
	readAllByOffer(offer: bigint, emt: EntityManager = null){
		return this.getEm(emt)
			.createQueryBuilder(OfferAmounts, 'oa')
		  .select(['oa.store', 'oa.amount'])
		  .where({'oa.offer': offer })
		  .execute();
	}
	
}