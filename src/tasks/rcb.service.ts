import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { EntityManager, raw, sql } from '@mikro-orm/postgresql'
import { HttpService } from '@nestjs/axios'
import { Rates } from './../entities/Rates'
import { createWriteStream, existsSync } from 'node:fs'
import { uid } from 'uid';
import { lookup, extension } from 'mime-types'
import { Mutex, MutexInterface, Semaphore, SemaphoreInterface, withTimeout } from 'async-mutex';
import { XMLParser } from 'fast-xml-parser'
import { RatesSourcesService } from './../api/services/rates-sources.service'
import { CurrenciesService } from './../api/services/currencies.service'
import { CreateRatesSourceDto } from './../api/dtos/create-rates-source.dto'
import { CreateCurrencyDto } from './../api/dtos/create-currency.dto'

@Injectable()
export class RCBService {
	
  private readonly logger = new Logger('her');
  private loading = false;
  
  protected source = null;
  protected baseCurrency = null;
  protected readonly sourceTitle = 'Rus CB';
  protected readonly sourceTimezone = 'Europe/Moscow';
  protected readonly baseCurrencyTitle = 'Российский рубль';
  protected readonly baseCurrencyKey = 'RUB';
  
	constructor(
		protected readonly currenciesService: CurrenciesService,
		protected readonly ratesSourcesService: RatesSourcesService,
		protected readonly em: EntityManager,
		private readonly httpService: HttpService,
	){}
	
	protected async loadSource(){
		this.source = await this.ratesSourcesService.findByTitle(this.sourceTitle);
		if(this.source===null){
			const dto = new CreateRatesSourceDto();
			dto.title = this.sourceTitle;
			dto.timezone = this.sourceTimezone;
			dto.baseCurrency = this.baseCurrency.id;
			this.source = await this.ratesSourcesService.create(dto);
		}
	}
	
	protected async loadBaseCurrency(){
		this.baseCurrency = await this.loadCurrency(this.baseCurrencyKey, this.baseCurrencyTitle);
	}
	
	protected async loadCurrency(key, title){
		let currency = await this.currenciesService.findByKey(key);
		if(currency===null){
			const dto = new CreateCurrencyDto();
			dto.key = key;
			dto.title = title;
			currency = await this.currenciesService.create(dto);
		}
		return currency;
	}
	
  @Cron('* * * * *')
  async handleCron() {
	  const ukey = uid(5);
	  if(this.loading) {
		  console.log('locked '+ukey);
		  return;
		}
		await this.loadBaseCurrency();
		await this.loadSource();
		//console.log('start '+ukey);
	  this.loading = true;
	  try{
		  const em = this.em.fork(),
		  			conn = em.getConnection(),
		  			parser = new XMLParser(),
		  			response = await this.httpService.axiosRef.get('https://www.cbr-xml-daily.ru/daily_utf8.xml'),
						data = parser.parse(response.data),
						date = new Date();
		  for(let item of data.ValCurs.Valute){
				if(!item.hasOwnProperty('CharCode') || !item.hasOwnProperty('VunitRate')) continue;
				const currency = await this.loadCurrency(item.CharCode, item.Name),
							rate = item.VunitRate.replace(',', '.');
				await em.upsert(Rates, {
					from: currency.id,
					to: this.baseCurrency.id,
					source: this.source.id,
					rate: rate,
					updatedAt: date
				});
				await em.upsert(Rates, {
					from: this.baseCurrency.id,
					to: currency.id,
					source: this.source.id,
					rate: (1/rate).toFixed(9),
					updatedAt: date
				});
		  }
		  em.flush();
		}catch(e){
			console.log('error '+ukey);
			console.log(e);
			//console.log(e.errno);
		}finally{
			this.loading = false;
		}
  }
}