import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { EntityManager } from '@mikro-orm/postgresql'
import { HttpService } from '@nestjs/axios'
import { CatalogBrands } from './../entities/CatalogBrands'
import { createWriteStream, existsSync } from 'node:fs'
import { uid } from 'uid';
import { lookup, extension } from 'mime-types'
import { Mutex, MutexInterface, Semaphore, SemaphoreInterface, withTimeout } from 'async-mutex';


@Injectable()
export class ImagesService {
	
  private readonly logger = new Logger('her');
  private loading = false;
  
	constructor(
		protected readonly em: EntityManager,
		private readonly httpService: HttpService,
	){}

  //@Cron('* * * * * *')
  async handleCron() {
	  const ukey = uid(5);
	  if(this.loading) {
		  console.log('locked '+ukey);
		  return;
		}
		//console.log('start '+ukey);
	  this.loading = true;
	  try{
		  const em = this.em.fork(),
		  			conn = em.getConnection();
		  const query = `SELECT id, logo 
		  							 FROM catalog_brands
										 WHERE logo ->> 'status' = '0'
										 LIMIT 10`;
		  const list = await conn.execute(query);
			for(let item of list){
				try{
					const response = await this.httpService.axiosRef.get(item.logo.url, {
									responseType: 'stream'
								}),
								mime = lookup(item.logo.url),
								ext = extension(mime);
					console.log('response '+ukey);
					let key = "0-0-0-"+uid(21)+"."+ext;
					while(existsSync("images/"+key)){
						key = "0-0-0-"+uid(21)+"."+ext;
					}
		      const writer = createWriteStream("images/"+key);
		      response.data.pipe(writer);
		   		await conn.execute(em.createQueryBuilder(CatalogBrands)
		   			.update({logo: {key: key, url: item.logo.url, status: 1}})
		   			.where({id: item.id})
		   			.getKnexQuery());
				}catch(e){
					if(e.response){
			   		await conn.execute(em.createQueryBuilder(CatalogBrands)
			   			.update({logo: {errorCode: e.response.statusText, errorNo: e.response.status, url: item.logo.url, status: -1}})
			   			.where({id: item.id})
			   			.getKnexQuery());
					}else{
			   		await conn.execute(em.createQueryBuilder(CatalogBrands)
			   			.update({logo: {errorCode: e.code, errorNo: e.errno, url: item.logo.url, status: -1}})
			   			.where({id: item.id})
			   			.getKnexQuery());
					}
				}
			}
		}catch(e){
			console.log('error '+ukey);
			//console.log(e.code);
			//console.log(e.errno);
		}finally{
			this.loading = false;
		}
  }
}