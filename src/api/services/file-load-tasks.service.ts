import { GenFileLoadTasksService } from './gen/file-load-tasks.service';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios'
import { uid } from 'uid';
import { existsSync } from 'node:fs'
import { lookup, extension } from 'mime-types'
import { CreateFileLoadTaskDto } from './../dtos/create-file-load-task.dto'
import { EntityManager, wrap } from '@mikro-orm/postgresql'
import { FileLoadTasks } from './../../entities/FileLoadTasks';
import { FilesService, FsPatch } from './special/files.service';

const gm = require("gm");

@Injectable()
export class FileLoadTasksService extends GenFileLoadTasksService {
	
  private loading = false;
  
	constructor(
		em: EntityManager,
		fm: FilesService,
		private readonly httpService: HttpService,
	){
		super(em, fm);
	}
	
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
		  			list = await this.getNotLoaded(10, em);
			for(let item of list){
				try{
					await this.transactional(async (em, fm) =>{
						const response = await this.httpService.axiosRef.get(item.url, {
										responseType: 'arraybuffer'
									}),
									fileBuffer = Buffer.from(response.data, 'binary');
						await this.writeBuffer(fileBuffer, item.key, item.asImage, fm);
			   		item.processed = true;
			   		item.loaded = true;
			   		item.error = null;
			   		await em.persist(item).flush();
					})
				}catch(e){
		   		item.processed = true;
		   		item.loaded = false;
					if(e.response){
						item.error = `${e.response.status}: ${e.response.statusText}`;
					}else{
						item.error = `${e.errno}: ${e.code}`;
					}
		   		await em.persist(item).flush();
				}
			}
		}catch(e){
			console.log('error '+ukey);
		}finally{
			this.loading = false;
		}
  }
	
	async processInput(company: number, catalog: number, value: string, asImage: boolean, emt: EntityManager, fm: FsPatch){
		let list = value.split(':');
		if(list.length>3){
			const [a, b, ...c] = list;
			list = [a, b, c.join(':')];
		}
		if(list.length>1){
			switch(list[0]){
				case 'url':
					if(list.length===3){
						return await this.loadUrl(company, catalog, list[2].trim(), list[1].trim(), asImage, emt);
					}else if(list.length===2){
						throw new Error('Extension is missed (correct format: `url:[extension, can be missed]:[base-64 encoded content]`)')
					}
				 	break;
				case 'b64':
					if(list.length===3){
						return await this.store64(company, catalog, list[2].trim(), list[1].trim(), asImage, fm);
					}else{
						throw new Error('Extension is missed (correct format: `b64:[extension]:[base-64 encoded content]`)')
					}
				 	break;
			}
		}else{
			const parts = value.split('-');
			if(parts.length===5){
				const [_, icompany, icatalog] = parts;
				if(parseInt(icompany)!==company || parseInt(icatalog)!==catalog){
					throw new Error('Wrong key')
				}
				return value;
			}
		}
		throw new Error('Unknown input format')
	}
	
	private getNotLoaded(limit: number, emt: EntityManager = null){
		return this.getEm(emt).find(FileLoadTasks, {
			processed: false
		}, {
			limit: limit,
			orderBy: { id: "ASC" },
		});
	}
	
	async loadUrl(company: number, catalog: number, url: string, pext: string, asImage: boolean, emt: EntityManager = null){
		const mime = lookup(url),
					ext = pext || extension(mime),
					key = this.newKey(company, catalog, ext),
					dto = new CreateFileLoadTaskDto();
		dto.company = company;
		dto.url = url;
		dto.asImage = asImage;
		dto.key = key;
		await this.create(dto, emt);
		return key;
	}
		
	async store64(company: number, catalog: number, data: string, ext: string, asImage: boolean, fm: FsPatch){
		const key = this.newKey(company, catalog, ext);
		await this.writeBuffer(Buffer.from(data, "base64"), key, asImage, fm);
		return key;
	}
		
	private toBuffer(im){
		return new Promise<Buffer>((resolve, reject) => {
	    im.toBuffer(function(error, buffer) {
			  if(error) reject(error);
			  else resolve(buffer);
			})
	  })
	}
	
	private size(im){
		return new Promise<any>((resolve, reject) => {
	    im.size(function(error, size) {
			  if(error) reject(error);
			  else resolve(size)
			})
	  })
	}
	
	async writeBuffer(buffer, key, asImage, fm: FsPatch){
		if(asImage){
			const im = gm(buffer),
						size = await this.size(im);
			await fm.write(`./images/${key}`, await this.toBuffer(im.noProfile()));
			if(size.width>512 || size.height>512){
				await fm.write(`./images/p-${key}`, 
					await this.toBuffer(im
					.resize(512, 512)
					.noProfile()
					.strip()));
			}else{
				await fm.write(`./images/p-${key}`, await this.toBuffer(im.noProfile()));
			}
		}else{
			await fm.write(`./images/${key}`, buffer);
		}
	}
	
	private newKey(company: number, catalog: number = 0, ext: string){
		let key = `0-${company}-${catalog}-0-`+uid(21)+"."+ext;
		while(existsSync("images/"+key)){
			key = `0-${company}-${catalog}-0-`+uid(21)+"."+ext;
		}
		return key;
	}
	
}