import { GenOfferPricesService } from './gen/offer-prices.service'
import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule';

@Injectable()
export class OfferPricesService extends GenOfferPricesService {
	
  @Cron('17 */2 * * *')
	async sanitize(){
		const qu = `DELETE FROM public.offer_prices 
								WHERE "changed_at" < CURRENT_TIMESTAMP - INTERVAL '1 week'
									AND "deleted"`;
		await this.getEm().getConnection().execute(qu);
	}
	
}