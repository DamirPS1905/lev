import { GenRatesService } from './gen/rates.service'
import { Injectable } from '@nestjs/common'
import { EntityManager, wrap } from '@mikro-orm/postgresql'
import { CurrenciesService } from './currencies.service'
import { RatesSourcesService } from './rates-sources.service'
import { FilesService } from './special/files.service';

@Injectable()
export class RatesService extends GenRatesService {
	
	constructor(
		protected readonly currenciesService: CurrenciesService,
		protected readonly ratesSourcesService: RatesSourcesService,
		em: EntityManager,
		fm: FilesService,
	){
		super(em, fm);
	}
	
	async getRate(from: number, to: number, sourceId: number = 1){
		if(from===to) return 1;
		const fromCurrency = await this.currenciesService.findById(from),
					toCurrency = await this.currenciesService.findById(to),
					source = await this.ratesSourcesService.findById(sourceId);
		if(fromCurrency===null){
			throw new Error('Curreny '+from+' not found');
		}
		if(toCurrency===null){
			throw new Error('Curreny '+to+' not found');
		}
		if(source===null){
			throw new Error('Source not found');
		}
		let rate = 1;
		if(fromCurrency.id!==source.baseCurrency.id){
			const toBase = await this.findByFromAndToAndSource(fromCurrency.id, source.baseCurrency.id, source.id);
			if(toBase===null){
				throw new Error('Unable detrminate rate using current source');
			}
			rate *= parseFloat(toBase.rate);
		}
		if(toCurrency.id!==source.baseCurrency.id){
			const fromBase = await this.findByFromAndToAndSource(source.baseCurrency.id, toCurrency.id, source.id);
			if(fromBase===null){
				throw new Error('Unable detrminate rate using current source');
			}
			rate *= parseFloat(fromBase.rate);
		}
		return rate;
	}
	
}